/**
 * Red de rutas neón sobre el globo.
 * Nodos (hubs) unidos por arcos parabólicos que se dibujan solos:
 * una traza viaja de origen a destino y deja estela, sobre una malla
 * tenue permanente que da la sensación de red.
 */
const NEON = 0x6ec9d6
const NEON_HOT = 0xe6fbff
const NODE_COLOR = 0x9fe6f2

/** Radio de apoyo: apenas por encima de la superficie */
const SURFACE = 1.004

/** Ancho base de la traza en px CSS: núcleo + difuminado lateral */
const TRACE_WIDTH = 5.6
/** Factor global de tamaño de las trazas (+30%) */
const TRACE_SCALE = 1.3

/** Hubs reales (lat, lng) — la red lee como cobertura logística */
const HUBS = [
  [10.39, -75.51], // Cartagena
  [4.71, -74.07], // Bogotá
  [3.88, -77.03], // Buenaventura
  [8.98, -79.52], // Panamá
  [25.77, -80.19], // Miami
  [40.71, -74.01], // Nueva York
  [33.74, -118.27], // Los Ángeles
  [49.28, -123.12], // Vancouver
  [19.17, -96.13], // Veracruz
  [-23.96, -46.33], // Santos
  [-33.05, -71.61], // Valparaíso
  [-34.6, -58.44], // Buenos Aires
  [51.92, 4.48], // Rotterdam
  [53.55, 9.99], // Hamburgo
  [36.13, -5.45], // Algeciras
  [6.45, 3.39], // Lagos
  [-29.86, 31.02], // Durban
  [25.01, 55.06], // Jebel Ali
  [18.95, 72.84], // Mumbai
  [1.29, 103.85], // Singapur
  [31.23, 121.47], // Shanghái
  [22.54, 114.06], // Shenzhen
  [35.1, 129.04], // Busan
  [35.65, 139.84], // Tokio
  [-33.87, 151.21], // Sídney
  [-36.85, 174.76], // Auckland
]

/** Pares origen–destino; las primeras son las que sobreviven en lite */
const ROUTES = [
  [0, 4],
  [0, 14],
  [2, 19],
  [4, 5],
  [5, 12],
  [3, 10],
  [9, 15],
  [12, 17],
  [17, 19],
  [19, 20],
  [6, 23],
  [16, 18],
  [1, 0],
  [8, 4],
  [9, 12],
  [10, 19],
  [11, 16],
  [12, 13],
  [13, 20],
  [14, 17],
  [15, 16],
  [18, 19],
  [19, 24],
  [20, 6],
  [21, 23],
  [22, 23],
  [7, 22],
  [24, 25],
]

function latLngToVector3(lat, lng, radius, THREE) {
  const phi = THREE.MathUtils.degToRad(90 - lat)
  const theta = THREE.MathUtils.degToRad(lng + 180)
  return new THREE.Vector3(
    -radius * Math.sin(phi) * Math.cos(theta),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta),
  )
}

/**
 * Arco parabólico sobre la esfera: dirección por interpolación esférica
 * (gran círculo) y radio con perfil seno → sube y baja como una parábola.
 */
function sampleArc(from, to, segments, THREE) {
  const dot = THREE.MathUtils.clamp(from.dot(to), -1, 1)
  const omega = Math.acos(dot)
  const sinOmega = Math.sin(omega)
  // Techo bajo a propósito: al final del scroll la cámara queda a 1.48
  const lift = 0.04 + (omega / Math.PI) * 0.16
  const points = new Float32Array((segments + 1) * 3)
  const dir = new THREE.Vector3()

  for (let i = 0; i <= segments; i += 1) {
    const t = i / segments
    if (sinOmega < 1e-4) {
      dir.copy(from).lerp(to, t).normalize()
    } else {
      dir
        .copy(from)
        .multiplyScalar(Math.sin((1 - t) * omega) / sinOmega)
        .addScaledVector(to, Math.sin(t * omega) / sinOmega)
        .normalize()
    }
    const radius = SURFACE + lift * Math.sin(Math.PI * t)
    points[i * 3] = dir.x * radius
    points[i * 3 + 1] = dir.y * radius
    points[i * 3 + 2] = dir.z * radius
  }

  return points
}

function createArcMaterial(THREE, { lite, viewport }) {
  return new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uReveal: { value: 1 },
      uPulse: { value: 1 },
      uGap: { value: 0.55 },
      uTrail: { value: lite ? 0.16 : 0.2 },
      uHeadLen: { value: 0.035 },
      uBase: { value: lite ? 0.07 : 0.09 },
      uOpacity: { value: lite ? 0.5 : 0.62 },
      uWidth: { value: TRACE_WIDTH * TRACE_SCALE },
      uResolution: {
        value: new THREE.Vector2(viewport.width, viewport.height),
      },
      uColor: { value: new THREE.Color(NEON) },
      uHotColor: { value: new THREE.Color(NEON_HOT) },
    },
    vertexShader: `
      attribute vec3 aTangent;
      attribute float aSide;
      attribute float aProgress;
      attribute float aOffset;
      attribute float aSpeed;

      uniform float uTime;
      uniform float uGap;
      uniform float uWidth;
      uniform vec2 uResolution;

      varying float vDist;
      varying float vSide;

      void main() {
        // El cabezal recorre -uGap .. 1 → hay una pausa limpia entre ciclos
        float cycle = fract(uTime * aSpeed + aOffset);
        float head = cycle * (1.0 + uGap) - uGap;
        vDist = head - aProgress;
        vSide = aSide;

        // Cinta orientada a cámara: se ensancha en pantalla, perpendicular
        // a la tangente proyectada → grosor constante en píxeles
        vec4 clip = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        vec4 clipAhead =
          projectionMatrix * modelViewMatrix * vec4(position + aTangent, 1.0);

        vec2 screen = (clip.xy / clip.w) * uResolution;
        vec2 screenAhead = (clipAhead.xy / clipAhead.w) * uResolution;
        vec2 along = screenAhead - screen;
        float len = length(along);
        vec2 across = len > 0.0001
          ? vec2(-along.y, along.x) / len
          : vec2(0.0, 1.0);

        clip.xy += across * aSide * uWidth / uResolution * clip.w;
        gl_Position = clip;
      }
    `,
    fragmentShader: `
      uniform float uReveal;
      uniform float uPulse;
      uniform float uTrail;
      uniform float uHeadLen;
      uniform float uBase;
      uniform float uOpacity;
      uniform vec3 uColor;
      uniform vec3 uHotColor;

      varying float vDist;
      varying float vSide;

      void main() {
        float drawn = step(0.0, vDist);
        float d = max(vDist, 0.0);
        float trail = exp(-d / uTrail) * drawn;
        float hot = exp(-pow(d / uHeadLen, 2.0)) * drawn;

        // Perfil transversal difuminado: filamento nítido + halo suave
        float span = abs(vSide);
        float core = exp(-pow(span / 0.2, 2.0));
        float bloom = exp(-pow(span / 0.5, 2.0)) * (0.42 + hot * 0.5);
        float soft = (core + bloom) * (1.0 - smoothstep(0.84, 1.0, span));

        float energy = uBase * uPulse + trail * 0.55 + hot * 1.35;
        energy *= uReveal;

        vec3 color = mix(uColor, uHotColor, clamp(hot + core * 0.35, 0.0, 1.0));
        gl_FragColor = vec4(
          color * (1.0 + hot * 1.4),
          energy * soft * uOpacity
        );
      }
    `,
    transparent: true,
    depthWrite: false,
    toneMapped: false,
    side: THREE.DoubleSide,
    blending: THREE.AdditiveBlending,
  })
}

function createNodeMaterial(THREE, { lite, viewportHeight }) {
  return new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uReveal: { value: 1 },
      uViewportHeight: { value: viewportHeight },
      uColor: { value: new THREE.Color(NODE_COLOR) },
      uHotColor: { value: new THREE.Color(NEON_HOT) },
      uOpacity: { value: lite ? 0.72 : 0.9 },
    },
    vertexShader: `
      attribute float aSize;
      attribute float aSeed;

      uniform float uTime;
      uniform float uViewportHeight;

      varying float vBeat;

      void main() {
        vBeat = 0.55 + 0.45 * sin(uTime * 1.6 + aSeed * 6.2831);
        vec4 mv = modelViewMatrix * vec4(position, 1.0);
        // aSize va en unidades de mundo → tamaño real por proyección
        float scale = projectionMatrix[1][1] * uViewportHeight * 0.5;
        float size = aSize * (1.0 + vBeat * 0.3) * scale / max(-mv.z, 0.05);
        gl_PointSize = clamp(size, 1.0, 46.0);
        gl_Position = projectionMatrix * mv;
      }
    `,
    fragmentShader: `
      uniform vec3 uColor;
      uniform vec3 uHotColor;
      uniform float uOpacity;
      uniform float uReveal;

      varying float vBeat;

      void main() {
        float r = length(gl_PointCoord - vec2(0.5));
        if (r > 0.5) discard;

        float core = exp(-pow(r / 0.13, 2.0));
        float halo = exp(-pow(r / 0.34, 2.2)) * 0.45;
        float alpha = (core + halo) * (0.55 + vBeat * 0.45) * uOpacity * uReveal;

        vec3 color = mix(uColor, uHotColor, core);
        gl_FragColor = vec4(color * (1.0 + core * 0.8), alpha);
      }
    `,
    transparent: true,
    depthWrite: false,
    toneMapped: false,
    blending: THREE.AdditiveBlending,
  })
}

function createSparkMaterial(THREE, { lite, viewportHeight }) {
  return new THREE.ShaderMaterial({
    uniforms: {
      uReveal: { value: 1 },
      uViewportHeight: { value: viewportHeight },
      uSize: { value: (lite ? 0.026 : 0.03) * TRACE_SCALE },
      uColor: { value: new THREE.Color(NEON_HOT) },
      uOpacity: { value: lite ? 0.8 : 1 },
    },
    vertexShader: `
      attribute float aAlpha;
      uniform float uViewportHeight;
      uniform float uSize;
      varying float vAlpha;

      void main() {
        vAlpha = aAlpha;
        vec4 mv = modelViewMatrix * vec4(position, 1.0);
        float scale = projectionMatrix[1][1] * uViewportHeight * 0.5;
        float size = uSize * scale / max(-mv.z, 0.05);
        gl_PointSize = aAlpha > 0.001 ? clamp(size, 1.0, 54.0) : 0.0;
        gl_Position = projectionMatrix * mv;
      }
    `,
    fragmentShader: `
      uniform vec3 uColor;
      uniform float uOpacity;
      uniform float uReveal;
      varying float vAlpha;

      void main() {
        float r = length(gl_PointCoord - vec2(0.5));
        if (r > 0.5) discard;
        float core = exp(-pow(r / 0.16, 2.0));
        float halo = exp(-pow(r / 0.4, 2.0)) * 0.5;
        gl_FragColor = vec4(uColor, (core + halo) * vAlpha * uOpacity * uReveal);
      }
    `,
    transparent: true,
    depthWrite: false,
    toneMapped: false,
    blending: THREE.AdditiveBlending,
  })
}

/**
 * Construye la red completa (arcos + nodos + chispas viajeras) en
 * tres draw calls: todo se fusiona en una sola geometría por tipo.
 */
export function createNetworkTraces(
  THREE,
  { lite = false, viewport = { width: 1440, height: 900, pixelRatio: 1 } } = {},
) {
  const root = new THREE.Group()
  root.name = 'globe-network'
  // Un stage aún sin medir daría 0 → división por cero en los shaders
  const view = {
    width: viewport.width || 1440,
    height: viewport.height || 900,
    pixelRatio: viewport.pixelRatio || 1,
  }
  const viewportHeight = view.height * view.pixelRatio

  const segments = lite ? 36 : 64
  const routes = lite ? ROUTES.slice(0, 12) : ROUTES
  const gap = 0.55

  const nodeVectors = HUBS.map(([lat, lng]) =>
    latLngToVector3(lat, lng, 1, THREE),
  )

  // —— Arcos: cintas indexadas, dos vértices (±ancho) por muestra ——
  const arcs = []
  const perArc = (segments + 1) * 2
  const totalVerts = routes.length * perArc
  const arcPos = new Float32Array(totalVerts * 3)
  const arcTangent = new Float32Array(totalVerts * 3)
  const arcSide = new Float32Array(totalVerts)
  const arcProgress = new Float32Array(totalVerts)
  const arcOffset = new Float32Array(totalVerts)
  const arcSpeed = new Float32Array(totalVerts)
  const arcIndex = new Uint32Array(routes.length * segments * 6)

  let vertexCursor = 0
  let indexCursor = 0
  routes.forEach(([a, b], index) => {
    const samples = sampleArc(nodeVectors[a], nodeVectors[b], segments, THREE)
    const offset = (index * 0.618) % 1
    const speed = 0.055 + ((index * 0.37) % 1) * 0.05
    const base = vertexCursor

    for (let i = 0; i <= segments; i += 1) {
      const p = i * 3
      // Tangente por diferencias centradas; en los extremos, lateral
      const prev = Math.max(i - 1, 0) * 3
      const next = Math.min(i + 1, segments) * 3
      const tx = samples[next] - samples[prev]
      const ty = samples[next + 1] - samples[prev + 1]
      const tz = samples[next + 2] - samples[prev + 2]

      for (let side = 0; side < 2; side += 1) {
        const v = vertexCursor * 3
        arcPos[v] = samples[p]
        arcPos[v + 1] = samples[p + 1]
        arcPos[v + 2] = samples[p + 2]
        arcTangent[v] = tx
        arcTangent[v + 1] = ty
        arcTangent[v + 2] = tz
        arcSide[vertexCursor] = side === 0 ? -1 : 1
        arcProgress[vertexCursor] = i / segments
        arcOffset[vertexCursor] = offset
        arcSpeed[vertexCursor] = speed
        vertexCursor += 1
      }
    }

    for (let i = 0; i < segments; i += 1) {
      const q = base + i * 2
      arcIndex[indexCursor] = q
      arcIndex[indexCursor + 1] = q + 1
      arcIndex[indexCursor + 2] = q + 2
      arcIndex[indexCursor + 3] = q + 1
      arcIndex[indexCursor + 4] = q + 3
      arcIndex[indexCursor + 5] = q + 2
      indexCursor += 6
    }

    arcs.push({ samples, offset, speed })
  })

  const arcGeo = new THREE.BufferGeometry()
  arcGeo.setAttribute('position', new THREE.BufferAttribute(arcPos, 3))
  arcGeo.setAttribute('aTangent', new THREE.BufferAttribute(arcTangent, 3))
  arcGeo.setAttribute('aSide', new THREE.BufferAttribute(arcSide, 1))
  arcGeo.setAttribute('aProgress', new THREE.BufferAttribute(arcProgress, 1))
  arcGeo.setAttribute('aOffset', new THREE.BufferAttribute(arcOffset, 1))
  arcGeo.setAttribute('aSpeed', new THREE.BufferAttribute(arcSpeed, 1))
  arcGeo.setIndex(new THREE.BufferAttribute(arcIndex, 1))

  const arcMaterial = createArcMaterial(THREE, { lite, viewport: view })
  arcMaterial.uniforms.uGap.value = gap
  const arcRibbons = new THREE.Mesh(arcGeo, arcMaterial)
  arcRibbons.renderOrder = 2
  // La cinta se ensancha en el vertex shader: el bounding sphere se queda corto
  arcRibbons.frustumCulled = false
  root.add(arcRibbons)

  // —— Nodos ——
  const usedNodes = [...new Set(routes.flat())]
  const nodePos = new Float32Array(usedNodes.length * 3)
  const nodeSize = new Float32Array(usedNodes.length)
  const nodeSeed = new Float32Array(usedNodes.length)
  const degree = new Map()
  routes.forEach(([a, b]) => {
    degree.set(a, (degree.get(a) || 0) + 1)
    degree.set(b, (degree.get(b) || 0) + 1)
  })

  usedNodes.forEach((hub, i) => {
    const v = nodeVectors[hub].clone().multiplyScalar(SURFACE)
    nodePos[i * 3] = v.x
    nodePos[i * 3 + 1] = v.y
    nodePos[i * 3 + 2] = v.z
    nodeSize[i] =
      (lite ? 0.013 : 0.015) + Math.min(degree.get(hub) || 1, 4) * 0.0028
    nodeSeed[i] = (i * 0.437) % 1
  })

  const nodeGeo = new THREE.BufferGeometry()
  nodeGeo.setAttribute('position', new THREE.BufferAttribute(nodePos, 3))
  nodeGeo.setAttribute('aSize', new THREE.BufferAttribute(nodeSize, 1))
  nodeGeo.setAttribute('aSeed', new THREE.BufferAttribute(nodeSeed, 1))

  const nodeMaterial = createNodeMaterial(THREE, { lite, viewportHeight })
  const nodes = new THREE.Points(nodeGeo, nodeMaterial)
  nodes.renderOrder = 3
  root.add(nodes)

  // —— Chispas: un punto por ruta, posicionado en el cabezal ——
  const sparkPos = new Float32Array(arcs.length * 3)
  const sparkAlpha = new Float32Array(arcs.length)
  const sparkGeo = new THREE.BufferGeometry()
  sparkGeo.setAttribute('position', new THREE.BufferAttribute(sparkPos, 3))
  sparkGeo.setAttribute('aAlpha', new THREE.BufferAttribute(sparkAlpha, 1))
  const sparkMaterial = createSparkMaterial(THREE, { lite, viewportHeight })
  const sparks = new THREE.Points(sparkGeo, sparkMaterial)
  sparks.renderOrder = 4
  // Las posiciones cambian cada frame: el bounding sphere inicial no vale
  sparks.frustumCulled = false
  root.add(sparks)

  /**
   * Las cintas se ensanchan en px CSS y los puntos en px del framebuffer,
   * así que hacen falta ambas medidas.
   */
  const setViewport = (width, height, pixelRatio = 1) => {
    if (!width || !height) return
    arcMaterial.uniforms.uResolution.value.set(width, height)
    const physicalHeight = height * pixelRatio
    nodeMaterial.uniforms.uViewportHeight.value = physicalHeight
    sparkMaterial.uniforms.uViewportHeight.value = physicalHeight
  }

  const setReveal = (value) => {
    const v = THREE.MathUtils.clamp(value, 0, 1)
    arcMaterial.uniforms.uReveal.value = v
    nodeMaterial.uniforms.uReveal.value = v
    sparkMaterial.uniforms.uReveal.value = v
  }

  const update = (time, pulse = 1) => {
    arcMaterial.uniforms.uTime.value = time
    arcMaterial.uniforms.uPulse.value = pulse
    nodeMaterial.uniforms.uTime.value = time

    for (let i = 0; i < arcs.length; i += 1) {
      const { samples, offset, speed } = arcs[i]
      const cycle = (time * speed + offset) % 1
      const head = cycle * (1 + gap) - gap
      if (head < 0 || head > 1) {
        sparkAlpha[i] = 0
        continue
      }
      // Se apaga al llegar para que el nodo destino tome el relevo
      sparkAlpha[i] = Math.min(head / 0.06, 1) * Math.min((1 - head) / 0.1, 1)

      const f = head * segments
      const i0 = Math.min(Math.floor(f), segments - 1)
      const t = f - i0
      const a = i0 * 3
      const b = (i0 + 1) * 3
      sparkPos[i * 3] = samples[a] + (samples[b] - samples[a]) * t
      sparkPos[i * 3 + 1] =
        samples[a + 1] + (samples[b + 1] - samples[a + 1]) * t
      sparkPos[i * 3 + 2] =
        samples[a + 2] + (samples[b + 2] - samples[a + 2]) * t
    }

    sparkGeo.attributes.position.needsUpdate = true
    sparkGeo.attributes.aAlpha.needsUpdate = true
  }

  update(0)

  return { root, update, setReveal, setViewport }
}
