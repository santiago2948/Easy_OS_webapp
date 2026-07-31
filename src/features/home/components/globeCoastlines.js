/** Cyan primario de la marca (--o-accent) */
const NEON = 0x6ec9d6
const NEON_SOFT = 0xa3dde6
const NEON_GLOW = 0x3ec4d8
const NEON_HOT = 0xd8f6fb
const BASE_RADIUS = 1.001

function latLngToVector3(lat, lng, radius, THREE) {
  const phi = THREE.MathUtils.degToRad(90 - lat)
  const theta = THREE.MathUtils.degToRad(lng + 180)
  return new THREE.Vector3(
    -radius * Math.sin(phi) * Math.cos(theta),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta),
  )
}

function collectLineRings(geometry) {
  if (geometry.type === 'LineString') return [geometry.coordinates]
  if (geometry.type === 'MultiLineString') return geometry.coordinates
  return []
}

function buildBaseLineGroup(geojson, THREE) {
  const group = new THREE.Group()
  group.name = 'coastline-base'

  for (const feature of geojson.features) {
    for (const ring of collectLineRings(feature.geometry)) {
      if (!ring || ring.length < 2) continue

      const positions = new Float32Array(ring.length * 3)
      for (let i = 0; i < ring.length; i += 1) {
        const [lng, lat] = ring[i]
        const v = latLngToVector3(lat, lng, BASE_RADIUS, THREE)
        positions[i * 3] = v.x
        positions[i * 3 + 1] = v.y
        positions[i * 3 + 2] = v.z
      }

      const geo = new THREE.BufferGeometry()
      geo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
      group.add(new THREE.Line(geo))
    }
  }

  return group
}

export function createMouseUniforms(THREE, { lite = false } = {}) {
  return {
    uMousePoint: { value: new THREE.Vector3(0, 1, 0) },
    uMouseActive: { value: 0 },
    uMouseStrength: { value: lite ? 0.72 : 1.12 },
    /** Núcleo muy pequeño (~5pt visual) */
    uMouseCoreRadius: { value: lite ? 0.032 : 0.036 },
    /** Halo compacto y difuso alrededor */
    uMouseRadius: { value: lite ? 0.082 : 0.102 },
  }
}

function mouseUniformRefs(mouseUniforms) {
  return {
    uMousePoint: mouseUniforms.uMousePoint,
    uMouseActive: mouseUniforms.uMouseActive,
    uMouseStrength: mouseUniforms.uMouseStrength,
    uMouseRadius: mouseUniforms.uMouseRadius,
    uMouseCoreRadius: mouseUniforms.uMouseCoreRadius,
  }
}

function mouseHighlightGlsl() {
  return `
    float mouseAngle = acos(clamp(dot(normalize(vLocalPos), normalize(uMousePoint)), -1.0, 1.0));
    float coreT = mouseAngle / uMouseCoreRadius;
    float haloT = mouseAngle / uMouseRadius;
    float mouseHot = exp(-pow(coreT, 3.4));
    float mouseHalo = exp(-pow(haloT, 1.75)) * 0.13 * (1.0 - mouseHot * 0.7);
    float mouseHighlight = (mouseHot + mouseHalo) * uMouseActive * uMouseStrength;
  `
}

function createGlowShaderMaterial(THREE, { color, opacity, additive }, mouseUniforms) {
  return new THREE.ShaderMaterial({
    uniforms: {
      uColor: { value: new THREE.Color(color) },
      uOpacity: { value: opacity },
      uPulse: { value: 1 },
      ...mouseUniformRefs(mouseUniforms),
    },
    vertexShader: `
      varying vec3 vLocalPos;
      void main() {
        vLocalPos = position;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform vec3 uColor;
      uniform float uOpacity;
      uniform float uPulse;
      uniform vec3 uMousePoint;
      uniform float uMouseActive;
      uniform float uMouseStrength;
      uniform float uMouseRadius;
      uniform float uMouseCoreRadius;

      varying vec3 vLocalPos;

      void main() {
        ${mouseHighlightGlsl()}

        float boost = 1.0 + mouseHighlight * 2.15;
        vec3 glow = uColor * (1.65 * uPulse * boost);
        float alpha = uOpacity * uPulse * (1.0 + mouseHighlight * 0.55);
        gl_FragColor = vec4(glow, alpha);
      }
    `,
    transparent: true,
    depthWrite: false,
    toneMapped: false,
    blending: additive ? THREE.AdditiveBlending : THREE.NormalBlending,
  })
}

function cloneLayerGroup(baseGroup, scale, material, renderOrder, THREE) {
  const layer = new THREE.Group()
  layer.scale.setScalar(scale)

  for (const line of baseGroup.children) {
    const glowLine = new THREE.Line(line.geometry, material)
    glowLine.renderOrder = renderOrder
    layer.add(glowLine)
  }

  return layer
}

/**
 * Contornos de costa/continentes con iluminación neón en capas.
 */
export function createCoastlineBorders(
  geojson,
  THREE,
  { lite = false, mouseUniforms } = {},
) {
  const root = new THREE.Group()
  root.name = 'coastline-borders'
  const pulseMaterials = []
  const mouse = mouseUniforms || createMouseUniforms(THREE, { lite })
  const baseGroup = buildBaseLineGroup(geojson, THREE)

  const layers = lite
    ? [
        {
          scale: 1.0038,
          opacity: 0.32,
          color: NEON_GLOW,
          additive: true,
          pulse: true,
          order: 1,
        },
        {
          scale: 1.0016,
          opacity: 0.55,
          color: NEON,
          additive: true,
          pulse: true,
          order: 2,
        },
        {
          scale: 1.0004,
          opacity: 1,
          color: NEON_HOT,
          additive: false,
          pulse: false,
          order: 3,
        },
      ]
    : [
        {
          scale: 1.032,
          opacity: 0.11,
          color: NEON,
          additive: true,
          pulse: true,
          order: 1,
        },
        {
          scale: 1.022,
          opacity: 0.2,
          color: NEON_GLOW,
          additive: true,
          pulse: true,
          order: 1,
        },
        {
          scale: 1.014,
          opacity: 0.38,
          color: NEON_SOFT,
          additive: true,
          pulse: true,
          order: 2,
        },
        {
          scale: 1.007,
          opacity: 0.72,
          color: NEON,
          additive: true,
          pulse: true,
          order: 2,
        },
        {
          scale: 1.0025,
          opacity: 1,
          color: NEON_HOT,
          additive: true,
          pulse: false,
          order: 3,
        },
        {
          scale: 1.0004,
          opacity: 1,
          color: NEON,
          additive: false,
          pulse: false,
          order: 4,
        },
      ]

  for (const layer of layers) {
    const material = createGlowShaderMaterial(THREE, layer, mouse)
    if (layer.pulse) {
      pulseMaterials.push({ uniforms: material.uniforms, material })
    }
    root.add(cloneLayerGroup(baseGroup, layer.scale, material, layer.order, THREE))
  }

  return { root, pulseMaterials, mouseUniforms: mouse }
}

/**
 * Capa aditiva sobre océano y continentes que sigue al mouse.
 */
export function createSurfaceGlowMesh(THREE, mouseUniforms, { lite = false } = {}) {
  const segs = lite ? 48 : 72
  const geo = new THREE.SphereGeometry(1.0006, segs, segs)
  const mat = new THREE.ShaderMaterial({
    uniforms: {
      ...mouseUniformRefs(mouseUniforms),
      uGlowColor: { value: new THREE.Color(NEON) },
      uOceanTint: { value: new THREE.Color(0x1a5a6b) },
    },
    vertexShader: `
      varying vec3 vLocalPos;
      void main() {
        vLocalPos = position;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform vec3 uMousePoint;
      uniform float uMouseActive;
      uniform float uMouseStrength;
      uniform float uMouseRadius;
      uniform float uMouseCoreRadius;
      uniform vec3 uGlowColor;
      uniform vec3 uOceanTint;
      varying vec3 vLocalPos;

      void main() {
        ${mouseHighlightGlsl()}

        float coreT = acos(clamp(dot(normalize(vLocalPos), normalize(uMousePoint)), -1.0, 1.0)) / uMouseCoreRadius;
        float mouseHot = exp(-pow(coreT, 3.4));

        vec3 glow = mix(uOceanTint, uGlowColor, mouseHot * 0.85) * mouseHighlight * 1.05;
        float alpha = mouseHighlight * 0.26;
        gl_FragColor = vec4(glow, alpha);
      }
    `,
    transparent: true,
    depthWrite: false,
    toneMapped: false,
    blending: THREE.AdditiveBlending,
  })

  const mesh = new THREE.Mesh(geo, mat)
  mesh.renderOrder = 1
  mesh.name = 'surface-mouse-glow'
  return mesh
}

export function applyEarthMouseGlow(material, mouseUniforms) {
  material.onBeforeCompile = (shader) => {
    shader.uniforms.uMousePoint = mouseUniforms.uMousePoint
    shader.uniforms.uMouseActive = mouseUniforms.uMouseActive
    shader.uniforms.uMouseStrength = mouseUniforms.uMouseStrength
    shader.uniforms.uMouseRadius = mouseUniforms.uMouseRadius
    shader.uniforms.uMouseCoreRadius = mouseUniforms.uMouseCoreRadius

    shader.vertexShader = shader.vertexShader
      .replace(
        '#include <common>',
        `#include <common>
        varying vec3 vEarthLocalPos;`,
      )
      .replace(
        '#include <begin_vertex>',
        `#include <begin_vertex>
        vEarthLocalPos = position;`,
      )

    shader.fragmentShader = shader.fragmentShader
      .replace(
        '#include <common>',
        `#include <common>
        uniform vec3 uMousePoint;
        uniform float uMouseActive;
        uniform float uMouseStrength;
        uniform float uMouseRadius;
        uniform float uMouseCoreRadius;
        varying vec3 vEarthLocalPos;`,
      )
      .replace(
        '#include <emissivemap_fragment>',
        `#include <emissivemap_fragment>
        float earthAngle = acos(clamp(dot(normalize(vEarthLocalPos), normalize(uMousePoint)), -1.0, 1.0));
        float earthCoreT = earthAngle / uMouseCoreRadius;
        float earthHaloT = earthAngle / uMouseRadius;
        float earthHot = exp(-pow(earthCoreT, 3.4));
        float earthHalo = exp(-pow(earthHaloT, 1.75)) * 0.13 * (1.0 - earthHot * 0.7);
        float earthHighlight = (earthHot + earthHalo) * uMouseActive * uMouseStrength;
        totalEmissiveRadiance += vec3(0.431, 0.788, 0.839) * earthHighlight * 0.72;`,
      )
  }
  material.customProgramCacheKey = () => 'earth-mouse-glow-v4'
}
