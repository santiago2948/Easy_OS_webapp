import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import {
  ATMOSPHERE_COLORS,
  applyEarthStyle,
  createAtmosphereShell,
  createMouseUniforms,
} from './globeSurface'
import { createNetworkTraces } from './globeNetwork'

gsap.registerPlugin(ScrollTrigger)

/** Texturas equirectangulares: sm 1024 · lg 1536 · xl 2048 */
const DAY_SM = '/media/earth-day-sm.jpg'
const DAY_LG = '/media/earth-day-lg.jpg'
const DAY_XL = '/media/earth-day-xl.jpg'
const TOPO_SM = '/media/earth-topo-sm.jpg'
const TOPO_LG = '/media/earth-topo-lg.jpg'
/** Malla hexagonal neón superpuesta (equirectangular, mismos UV) */
const MESH_MAP = '/media/earth-mesh-texture.png'

/** Recorrido del FOV durante el scroll */
const START_FOV = 40
const END_FOV = 52

/**
 * Globo 3D ligero: Three se importa en runtime, texturas chicas,
 * menos polígonos en móvil y el render se pausa fuera de vista.
 */
export default function GlobeOrbit({
  pinEnd = '+=260%',
  triggerSelector = '.orbit-hero',
}) {
  const stageRef = useRef(null)
  const canvasRef = useRef(null)

  useEffect(() => {
    const stage = stageRef.current
    const canvas = canvasRef.current
    if (!stage || !canvas) return undefined

    let disposed = false
    let frameId = 0
    let renderer
    let ctx
    let ro
    let io
    let visible = true

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const mobile = window.matchMedia('(max-width: 768px)').matches
    const saveData =
      navigator.connection?.saveData ||
      navigator.connection?.effectiveType === 'slow-2g' ||
      navigator.connection?.effectiveType === '2g'

    const lite = mobile || saveData
    const triggerEl =
      document.querySelector(triggerSelector) ||
      stage.closest('.orbit-hero') ||
      stage

    const startRadius = lite ? 6.1 : 5.8
    /**
     * Distancia final de la camara. El globo tiene radio 1, asi que a 1.48
     * su diametro ocupaba el 188% de la altura del viewport y estiraba la
     * textura ~3.8x. A 2.3 la llena casi exacta (99%) con ~2x.
     */
    const endRadius = lite ? 2.7 : 2.3
    /** Ancho de la equirectangular mas estrecha que se proyecta encima */
    const narrowestTexture = lite ? 1024 : 1774
    /** Magnificacion maxima tolerada antes de que se vean los texeles */
    const maxMagnification = 2.6

    ;(async () => {
      // Code-split: three.js solo se descarga al montar este componente
      const THREE = await import('three')
      if (disposed) return

      renderer = new THREE.WebGLRenderer({
        canvas,
        antialias: !lite,
        alpha: true,
        powerPreference: lite ? 'low-power' : 'high-performance',
      })
      renderer.setPixelRatio(
        Math.min(window.devicePixelRatio || 1, lite ? 1.5 : 2),
      )
      renderer.setClearColor(0x000000, 0)
      renderer.outputColorSpace = THREE.SRGBColorSpace

      const scene = new THREE.Scene()
      const camera = new THREE.PerspectiveCamera(START_FOV, 1, 0.1, 100)
      camera.position.set(0, 0.35, startRadius)

      scene.add(new THREE.AmbientLight(0x6ec8d8, 0.55))
      const key = new THREE.DirectionalLight(0xffffff, 1.25)
      key.position.set(4, 2.2, 3)
      scene.add(key)
      if (!lite) {
        const rim = new THREE.DirectionalLight(0x00a4bd, 0.45)
        rim.position.set(-3, -1, -2)
        scene.add(rim)
      }

      const group = new THREE.Group()
      scene.add(group)

      const segs = lite ? 40 : 80
      const earthGeo = new THREE.SphereGeometry(1, segs, segs)

      let earth
      let network
      let earthStyle
      let mouseUniforms
      let meshReady = false
      let meshFade = 0
      let glowTime = 0
      let netTime = 0
      let netReveal = 0
      let netRevealTarget = 0.55
      let stars

      const raycaster = new THREE.Raycaster()
      const pointerNdc = new THREE.Vector2()
      const mouseHitLocal = new THREE.Vector3()
      const mouseTarget = {
        point: new THREE.Vector3(0, 1, 0),
        active: 0,
      }
      let pointerInside = false

      mouseUniforms = createMouseUniforms(THREE)

      const state = {
        orbit: 0,
        radius: startRadius,
        tilt: 0.18,
        earthSpin: 0,
        fov: START_FOV,
      }
      const target = {
        orbit: 0,
        radius: startRadius,
        tilt: 0.18,
        fov: START_FOV,
      }

      // Estrellas: pocas / ninguna en save-data
      if (!saveData) {
        const count = lite ? 280 : 900
        const positions = new Float32Array(count * 3)
        for (let i = 0; i < count; i += 1) {
          const r = 18 + Math.random() * 28
          const theta = Math.random() * Math.PI * 2
          const phi = Math.acos(2 * Math.random() - 1)
          positions[i * 3] = r * Math.sin(phi) * Math.cos(theta)
          positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta)
          positions[i * 3 + 2] = r * Math.cos(phi)
        }
        const geo = new THREE.BufferGeometry()
        geo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
        stars = new THREE.Points(
          geo,
          new THREE.PointsMaterial({
            color: 0xb8e8f0,
            size: lite ? 0.045 : 0.035,
            sizeAttenuation: true,
            transparent: true,
            opacity: 0.8,
            depthWrite: false,
          }),
        )
        scene.add(stars)
      }

      // Atmósfera por Fresnel: halo en el limbo, centro limpio
      {
        group.add(
          createAtmosphereShell(THREE, {
            radius: 1.055,
            color: ATMOSPHERE_COLORS.inner,
            opacity: lite ? 0.5 : 0.62,
            power: 3.2,
            segments: lite ? 32 : 48,
          }),
        )
        if (!lite) {
          group.add(
            createAtmosphereShell(THREE, {
              radius: 1.18,
              color: ATMOSPHERE_COLORS.outer,
              opacity: 0.3,
              power: 2.1,
              segments: 56,
            }),
          )
        }
      }

      const placeCamera = () => {
        const a = state.orbit
        const r = state.radius
        const y = Math.sin(state.tilt) * r * 0.2
        camera.position.set(Math.sin(a) * r, y, Math.cos(a) * r)
        camera.fov = state.fov
        camera.updateProjectionMatrix()
        camera.lookAt(0, 0, 0)
      }

      // Una pantalla alta o con mucho DPR estira mas la textura sobre el
      // mismo globo, asi que el acercamiento se frena antes en esos casos.
      const zoom = { end: endRadius }
      const updateZoomLimit = () => {
        const heightPx = stage.clientHeight * renderer.getPixelRatio()
        if (!heightPx) return
        // Solo se ve un hemisferio: media equirectangular cubre el diametro
        const texelsAcross = narrowestTexture / 2
        const tanHalfFov = Math.tan(THREE.MathUtils.degToRad(END_FOV) / 2)
        const tanTheta =
          (maxMagnification * texelsAcross * tanHalfFov) / heightPx
        // Con radio de esfera 1:  tan(theta) = 1 / sqrt(d^2 - 1)
        const floor = Math.sqrt(1 + 1 / (tanTheta * tanTheta))
        zoom.end = Math.max(endRadius, floor)
      }

      const resize = () => {
        const w = stage.clientWidth
        const h = stage.clientHeight
        if (!w || !h) return
        renderer.setSize(w, h, false)
        camera.aspect = w / h
        camera.updateProjectionMatrix()
        updateZoomLimit()
        network?.setViewport(w, h, renderer.getPixelRatio())
      }
      resize()
      ro = new ResizeObserver(resize)
      ro.observe(stage)

      const loader = new THREE.TextureLoader()
      const desktop = !lite && !window.matchMedia('(max-width: 1200px)').matches
      const dayUrl = lite ? DAY_SM : desktop ? DAY_XL : DAY_LG
      const topoUrl = lite ? TOPO_SM : TOPO_LG

      const applyEarth = (dayMap, topo) => {
        if (disposed) {
          dayMap.dispose()
          topo?.dispose()
          return
        }
        dayMap.colorSpace = THREE.SRGBColorSpace
        dayMap.anisotropy = Math.min(
          16,
          renderer.capabilities.getMaxAnisotropy(),
        )
        dayMap.generateMipmaps = true
        dayMap.minFilter = THREE.LinearMipmapLinearFilter
        dayMap.magFilter = THREE.LinearFilter

        const mat = new THREE.MeshStandardMaterial({
          map: dayMap,
          // Mate total: un specular rompería la máscara plana de neón
          roughness: 1,
          metalness: 0,
          ...(topo
            ? { bumpMap: topo, bumpScale: lite ? 0.025 : 0.035 }
            : {}),
        })
        earthStyle = applyEarthStyle(THREE, mat, mouseUniforms, { lite })

        earth = new THREE.Mesh(earthGeo, mat)
        earth.rotation.z = THREE.MathUtils.degToRad(23.4) * 0.35
        group.add(earth)

        // Red de rutas: gira con el planeta para que los hubs no se despeguen
        network = createNetworkTraces(THREE, {
          lite,
          viewport: {
            width: stage.clientWidth,
            height: stage.clientHeight,
            pixelRatio: renderer.getPixelRatio(),
          },
        })
        network.setReveal(reduce ? 1 : 0)
        earth.add(network.root)

        stage.classList.add('is-globe-ready')
      }

      const updatePointerFromEvent = (clientX, clientY) => {
        const rect = canvas.getBoundingClientRect()
        if (!rect.width || !rect.height) return
        pointerNdc.x = ((clientX - rect.left) / rect.width) * 2 - 1
        pointerNdc.y = -((clientY - rect.top) / rect.height) * 2 + 1
        pointerInside = true
      }

      const onPointerMove = (event) => {
        updatePointerFromEvent(event.clientX, event.clientY)
      }

      const onPointerLeave = () => {
        pointerInside = false
      }

      stage.addEventListener('pointermove', onPointerMove)
      stage.addEventListener('pointerdown', onPointerMove)
      triggerEl.addEventListener('pointermove', onPointerMove)
      triggerEl.addEventListener('pointerdown', onPointerMove)
      triggerEl.addEventListener('pointerleave', onPointerLeave)

      const attachTopo = (topo) => {
        if (disposed) {
          topo?.dispose()
          return
        }
        if (!earth?.material || !topo) return
        earth.material.bumpMap = topo
        earth.material.bumpScale = lite ? 0.025 : 0.035
        earth.material.needsUpdate = true
      }

      const attachMesh = (meshMap) => {
        if (disposed || !earthStyle) {
          meshMap?.dispose()
          return
        }
        meshMap.colorSpace = THREE.SRGBColorSpace
        // La longitud es cíclica: sin repeat, el offset en u pegaría la
        // columna del borde a lo largo de toda la costura
        meshMap.wrapS = THREE.RepeatWrapping
        meshMap.anisotropy = Math.min(
          8,
          renderer.capabilities.getMaxAnisotropy(),
        )
        meshMap.generateMipmaps = true
        meshMap.minFilter = THREE.LinearMipmapLinearFilter
        meshMap.magFilter = THREE.LinearFilter
        earthStyle.setMeshMap(meshMap)
        meshReady = true
      }

      loader.load(dayUrl, (dayMap) => {
        applyEarth(dayMap, null)
        loader.load(topoUrl, attachTopo, undefined, () => {})
        // Es un PNG pesado: va de últimas y se salta en modo ahorro de datos
        if (!saveData) loader.load(MESH_MAP, attachMesh, undefined, () => {})
      })

      ctx = gsap.context(() => {
        if (reduce) {
          target.orbit = 0.45
          target.radius = zoom.end + 0.35
          target.fov = 46
          netReveal = 1
          netRevealTarget = 1
          placeCamera()
          return
        }

        ScrollTrigger.create({
          trigger: triggerEl,
          start: 'top top',
          end: pinEnd,
          pin: true,
          scrub: 1.65,
          anticipatePin: 1,
          onUpdate: (self) => {
            const p = self.progress
            const globePhase = Math.min(p / 0.68, 1)
            const ease = gsap.parseEase('power2.inOut')(globePhase)
            target.orbit = globePhase * Math.PI * 2 * 1.2
            target.radius = gsap.utils.interpolate(startRadius, zoom.end, ease)
            target.fov = gsap.utils.interpolate(START_FOV, END_FOV, ease)
            target.tilt = 0.1 + Math.sin(globePhase * Math.PI) * 0.32
            // La red se enciende a medida que la cámara se acerca
            netRevealTarget = 0.45 + globePhase * 0.55

            const fadeStart = 0.64
            const fadeEnd = 0.78
            const globeOpacity =
              p <= fadeStart
                ? 1
                : p >= fadeEnd
                  ? 0
                  : 1 - (p - fadeStart) / (fadeEnd - fadeStart)
            gsap.set(stage, { opacity: globeOpacity })

            const exitVeil = triggerEl.querySelector('.orbit-hero__exit-veil')
            if (exitVeil) {
              const veilStart = 0.68
              const veilEnd = 0.86
              const veilOpacity =
                p <= veilStart
                  ? 0
                  : p >= veilEnd
                    ? 1
                    : (p - veilStart) / (veilEnd - veilStart)
              gsap.set(exitVeil, { opacity: veilOpacity })
            }
          },
        })

        gsap.fromTo(
          '.orbit-hero__copy',
          { opacity: 1, y: 0 },
          {
            opacity: 0,
            y: -36,
            ease: 'none',
            scrollTrigger: {
              trigger: triggerEl,
              start: 'top top',
              end: '+=72%',
              scrub: true,
            },
          },
        )

        gsap.fromTo(
          '.orbit-hero__hint',
          { opacity: 0.75 },
          {
            opacity: 0,
            ease: 'none',
            scrollTrigger: {
              trigger: triggerEl,
              start: 'top top',
              end: '+=25%',
              scrub: true,
            },
          },
        )

        gsap.from('.orbit-hero__copy > *', {
          y: 22,
          opacity: 0,
          duration: 0.9,
          stagger: 0.08,
          ease: 'power2.out',
          delay: 0.15,
        })
      }, triggerEl)

      // Pausar RAF fuera de vista → menos CPU/batería
      io = new IntersectionObserver(
        ([entry]) => {
          visible = entry.isIntersecting
        },
        { threshold: 0.02 },
      )
      io.observe(stage)

      const tick = () => {
        if (disposed) return
        frameId = requestAnimationFrame(tick)
        if (!visible) return

        state.orbit += (target.orbit - state.orbit) * 0.1
        state.radius += (target.radius - state.radius) * 0.12
        state.tilt += (target.tilt - state.tilt) * 0.1
        state.fov += (target.fov - state.fov) * 0.1
        state.earthSpin += lite ? 0.0009 : 0.00115
        glowTime += lite ? 0.014 : 0.018
        if (!reduce) netTime += lite ? 0.011 : 0.014
        const glowPulse = reduce
          ? 1
          : 0.78 + 0.22 * Math.sin(glowTime * 1.35)

        if (network) {
          netReveal += (netRevealTarget - netReveal) * 0.06
          network.setReveal(netReveal)
          network.update(netTime, glowPulse)
        }

        if (earthStyle) {
          // Presencia global sin oscilar: solo entrada suave al cargar y el
          // acercamiento del scroll. El relieve por cursor va en el shader.
          meshFade += ((meshReady ? 1 : 0) - meshFade) * 0.04
          earthStyle.setMeshOpacity(meshFade * netReveal)
        }

        if (earth) earth.rotation.y = state.earthSpin
        if (stars) stars.rotation.y += 0.00012

        placeCamera()

        if (earth && !reduce) {
          if (pointerInside) {
            raycaster.setFromCamera(pointerNdc, camera)
            const hits = raycaster.intersectObject(earth, false)
            if (hits.length) {
              earth.worldToLocal(mouseHitLocal.copy(hits[0].point))
              mouseTarget.point.copy(mouseHitLocal)
              mouseTarget.active = 1
            } else {
              mouseTarget.active = 0
            }
          } else {
            mouseTarget.active = 0
          }

          mouseUniforms.uMousePoint.value.lerp(mouseTarget.point, 0.16)
          mouseUniforms.uMouseActive.value +=
            (mouseTarget.active - mouseUniforms.uMouseActive.value) * 0.14
        }

        renderer.render(scene, camera)
      }
      tick()

      let disposeScene = () => {
        // Vive en un uniform propio: la traversal de abajo no la ve
        earthStyle?.uniforms.uMeshMap.value?.dispose()
        earthStyle?.dispose()
        earthGeo.dispose()
        const disposedMaterials = new Set()
        scene.traverse((obj) => {
          if (obj.geometry && obj.geometry !== earthGeo) obj.geometry.dispose()
          if (obj.material) {
            const mats = Array.isArray(obj.material)
              ? obj.material
              : [obj.material]
            mats.forEach((m) => {
              if (disposedMaterials.has(m)) return
              disposedMaterials.add(m)
              if (m.map) m.map.dispose()
              if (m.bumpMap) m.bumpMap.dispose()
              m.dispose()
            })
          }
        })
        renderer?.dispose()
      }

      // Cleanup refs for dispose
      stage._globeDispose = disposeScene
      stage._globePointerCleanup = () => {
        stage.removeEventListener('pointermove', onPointerMove)
        stage.removeEventListener('pointerdown', onPointerMove)
        triggerEl.removeEventListener('pointermove', onPointerMove)
        triggerEl.removeEventListener('pointerdown', onPointerMove)
        triggerEl.removeEventListener('pointerleave', onPointerLeave)
      }
    })()

    return () => {
      disposed = true
      cancelAnimationFrame(frameId)
      ctx?.revert()
      ro?.disconnect()
      io?.disconnect()
      stage._globePointerCleanup?.()
      delete stage._globePointerCleanup
      stage._globeDispose?.()
      delete stage._globeDispose
    }
  }, [pinEnd, triggerSelector])

  return (
    <div className="globe-orbit" ref={stageRef}>
      <canvas className="globe-orbit__canvas" ref={canvasRef} />
      <div className="globe-orbit__vignette" aria-hidden="true" />
      <div className="globe-orbit__grid" aria-hidden="true" />
    </div>
  )
}
