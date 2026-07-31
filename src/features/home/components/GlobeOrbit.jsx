import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import {
  applyEarthMouseGlow,
  createCoastlineBorders,
  createMouseUniforms,
  createSurfaceGlowMesh,
} from './globeCoastlines'

gsap.registerPlugin(ScrollTrigger)

/** Texturas equirectangulares: sm 1024 · lg 1536 · xl 2048 */
const DAY_SM = '/media/earth-day-sm.jpg'
const DAY_LG = '/media/earth-day-lg.jpg'
const DAY_XL = '/media/earth-day-xl.jpg'
const TOPO_SM = '/media/earth-topo-sm.jpg'
const TOPO_LG = '/media/earth-topo-lg.jpg'

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
    const endRadius = lite ? 1.72 : 1.48

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
      const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 100)
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
      let mouseLight
      let coastPulseMaterials = []
      let mouseUniforms
      let glowTime = 0
      let stars

      const raycaster = new THREE.Raycaster()
      const pointerNdc = new THREE.Vector2()
      const mouseHitLocal = new THREE.Vector3()
      const mouseTarget = {
        point: new THREE.Vector3(0, 1, 0),
        active: 0,
      }
      let pointerInside = false

      mouseUniforms = createMouseUniforms(THREE, { lite })

      const state = {
        orbit: 0,
        radius: startRadius,
        tilt: 0.18,
        earthSpin: 0,
        fov: 40,
      }
      const target = {
        orbit: 0,
        radius: startRadius,
        tilt: 0.18,
        fov: 40,
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

      // Atmósfera simple (1 mesh en lite, 2 en desktop)
      {
        const atmo = new THREE.Mesh(
          new THREE.SphereGeometry(1.05, lite ? 32 : 48, lite ? 32 : 48),
          new THREE.MeshBasicMaterial({
            color: 0x3ec4d8,
            transparent: true,
            opacity: 0.13,
            side: THREE.BackSide,
            depthWrite: false,
          }),
        )
        group.add(atmo)
        if (!lite) {
          group.add(
            new THREE.Mesh(
              new THREE.SphereGeometry(1.12, lite ? 36 : 56, lite ? 36 : 56),
              new THREE.MeshBasicMaterial({
                color: 0x00a4bd,
                transparent: true,
                opacity: 0.06,
                side: THREE.BackSide,
                depthWrite: false,
              }),
            ),
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

      const resize = () => {
        const w = stage.clientWidth
        const h = stage.clientHeight
        if (!w || !h) return
        renderer.setSize(w, h, false)
        camera.aspect = w / h
        camera.updateProjectionMatrix()
      }
      resize()
      ro = new ResizeObserver(resize)
      ro.observe(stage)

      const loader = new THREE.TextureLoader()
      const dayUrl = lite ? DAY_SM : DAY_XL
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
          roughness: 0.85,
          metalness: 0.05,
          ...(topo
            ? { bumpMap: topo, bumpScale: lite ? 0.025 : 0.035 }
            : {}),
        })
        applyEarthMouseGlow(mat, mouseUniforms)

        earth = new THREE.Mesh(earthGeo, mat)
        earth.rotation.z = THREE.MathUtils.degToRad(23.4) * 0.35
        group.add(earth)

        const surfaceGlow = createSurfaceGlowMesh(THREE, mouseUniforms, { lite })
        earth.add(surfaceGlow)

        mouseLight = new THREE.PointLight(0x6ec9d6, 0, lite ? 3.5 : 5)
        mouseLight.distance = lite ? 1.55 : 2.15
        mouseLight.decay = 2.35
        earth.add(mouseLight)

        stage.classList.add('is-globe-ready')

        fetch('/media/world-coastlines.json')
          .then((res) => (res.ok ? res.json() : null))
          .then((geojson) => {
            if (disposed || !earth || !geojson?.features?.length) return
            const { root, pulseMaterials } = createCoastlineBorders(
              geojson,
              THREE,
              { lite, mouseUniforms },
            )
            coastPulseMaterials = pulseMaterials
            earth.add(root)
          })
          .catch(() => {})
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

      loader.load(dayUrl, (dayMap) => {
        if (lite) {
          loader.load(
            topoUrl,
            (topo) => applyEarth(dayMap, topo),
            undefined,
            () => applyEarth(dayMap),
          )
          return
        }
        loader.load(
          topoUrl,
          (topo) => applyEarth(dayMap, topo),
          undefined,
          () => applyEarth(dayMap),
        )
      })

      ctx = gsap.context(() => {
        if (reduce) {
          target.orbit = 0.45
          target.radius = endRadius + 0.35
          target.fov = 46
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
            target.radius = gsap.utils.interpolate(startRadius, endRadius, ease)
            target.fov = gsap.utils.interpolate(40, 52, ease)
            target.tilt = 0.1 + Math.sin(globePhase * Math.PI) * 0.32

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
        const glowPulse = reduce
          ? 1
          : 0.78 + 0.22 * Math.sin(glowTime * 1.35)

        if (coastPulseMaterials.length) {
          coastPulseMaterials.forEach((entry) => {
            if (entry.uniforms) {
              entry.uniforms.uPulse.value = glowPulse
            } else if (entry.baseOpacity != null) {
              entry.material.opacity = entry.baseOpacity * glowPulse
            }
          })
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

          if (mouseLight) {
            mouseLight.position.copy(mouseUniforms.uMousePoint.value)
            mouseLight.intensity =
              mouseUniforms.uMouseActive.value * (lite ? 1.55 : 2.85)
          }
        }

        renderer.render(scene, camera)
      }
      tick()

      let disposeScene = () => {
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
