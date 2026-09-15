/** Cyan atmosférico de la marca (--o-accent) */
const ATMO = 0x3ec4d8
const ATMO_DEEP = 0x00a4bd

/** Máscara de continentes: azul principal sobreexpuesto sobre océano apagado */
const LAND = 0x00e5ff
const LAND_HOT = 0xd9fbff
const OCEAN = 0x123a4f

/**
 * Punto del cursor proyectado sobre la esfera, en coordenadas locales.
 * Solo revela la malla hexagonal: ya no dibuja ninguna luz propia.
 */
export function createMouseUniforms(THREE) {
  return {
    uMousePoint: { value: new THREE.Vector3(0, 1, 0) },
    uMouseActive: { value: 0 },
  }
}

/**
 * Halo atmosférico por Fresnel: el borde del planeta se enciende y el
 * centro queda limpio. Sustituye el difuminado plano de las esferas
 * BackSide y sostiene la silueta ahora que no hay bordes de continentes.
 */
export function createAtmosphereShell(
  THREE,
  { radius, color, opacity, power, segments },
) {
  const mat = new THREE.ShaderMaterial({
    uniforms: {
      uColor: { value: new THREE.Color(color) },
      uOpacity: { value: opacity },
      uPower: { value: power },
    },
    vertexShader: `
      varying vec3 vWorldNormal;
      varying vec3 vViewDir;
      void main() {
        vec4 worldPos = modelMatrix * vec4(position, 1.0);
        vWorldNormal = normalize(mat3(modelMatrix) * normal);
        vViewDir = normalize(cameraPosition - worldPos.xyz);
        gl_Position = projectionMatrix * viewMatrix * worldPos;
      }
    `,
    fragmentShader: `
      uniform vec3 uColor;
      uniform float uOpacity;
      uniform float uPower;
      varying vec3 vWorldNormal;
      varying vec3 vViewDir;

      void main() {
        // Normal invertida: la esfera se dibuja por dentro (BackSide)
        float facing = max(dot(-vWorldNormal, vViewDir), 0.0);
        float fresnel = pow(1.0 - facing, uPower);
        gl_FragColor = vec4(uColor * fresnel * 1.35, fresnel * uOpacity);
      }
    `,
    transparent: true,
    depthWrite: false,
    toneMapped: false,
    side: THREE.BackSide,
    blending: THREE.AdditiveBlending,
  })

  const mesh = new THREE.Mesh(
    new THREE.SphereGeometry(radius, segments, segments),
    mat,
  )
  mesh.name = 'atmosphere-shell'
  return mesh
}

export const ATMOSPHERE_COLORS = { inner: ATMO, outer: ATMO_DEEP }

/**
 * Reemplaza el color fotográfico de la Tierra por una máscara: los
 * continentes se pintan con el azul principal sobreexpuesto (el relieve
 * de la textura empuja el tono hacia el blanco) y el océano queda apagado.
 * Encima compone la malla hexagonal, que se revela en un disco radial
 * alrededor del cursor.
 *
 * La máscara sale del propio Blue Marble: la tierra tiene rojo+verde por
 * encima del azul, y el hielo se rescata por luminancia (es casi blanco,
 * así que el criterio cromático solo no lo detecta).
 */
export function applyEarthStyle(
  THREE,
  material,
  mouseUniforms,
  { lite = false } = {},
) {
  // Sampler siempre válido: si aún no llegó la malla, suma negro (nada).
  // Evita recompilar el programa cuando la textura entra tarde.
  const blankMap = new THREE.DataTexture(new Uint8Array([0, 0, 0, 0]), 1, 1)
  blankMap.needsUpdate = true

  const styleUniforms = {
    uMeshMap: { value: blankMap },
    /**
     * La malla no está encuadrada igual que el Blue Marble: sus accidentes
     * caen ~7.5° al sur (la longitud sí coincide, ~0.5° de error).
     * Medido por correlación cruzada de ambas máscaras de tierra entre
     * -60° y +60°, donde el ajuste sube de 0.199 a 0.314.
     */
    uMeshOffset: { value: new THREE.Vector2(-0.00139, -0.04167) },
    /** Presencia global de la malla: la conduce el render loop */
    uMeshOpacity: { value: 0 },
    /** Visibilidad de base, lejos del cursor */
    uMeshBase: { value: 0.22 },
    /** Opacidad extra en el centro del disco del cursor */
    uMeshPeak: { value: lite ? 0.85 : 1.05 },
    /**
     * Radio angular del disco, en radianes sobre la esfera.
     * ~0.5 rad cubre cerca de un tercio del hemisferio visible.
     */
    uMeshRadius: { value: lite ? 0.42 : 0.52 },
    uOceanColor: { value: new THREE.Color(OCEAN) },
    uLandColor: { value: new THREE.Color(LAND) },
    uLandHot: { value: new THREE.Color(LAND_HOT) },
    /** Cuánto se autoilumina la tierra: sube para sobreexponer más */
    uLandGlow: { value: lite ? 0.5 : 0.62 },
    uLandExposure: { value: 0.6 },
    /**
     * El albedo va por debajo del tono emisivo a propósito: con albedo
     * pleno la luz direccional ya satura sola y el relieve se aplana.
     */
    uLandAlbedo: { value: 0.45 },
    uOceanLift: { value: 0.55 },
  }

  material.onBeforeCompile = (shader) => {
    Object.assign(shader.uniforms, styleUniforms, {
      uMousePoint: mouseUniforms.uMousePoint,
      uMouseActive: mouseUniforms.uMouseActive,
    })

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
        uniform sampler2D uMeshMap;
        uniform vec2 uMeshOffset;
        uniform float uMeshOpacity;
        uniform float uMeshBase;
        uniform float uMeshPeak;
        uniform float uMeshRadius;
        uniform vec3 uOceanColor;
        uniform vec3 uLandColor;
        uniform vec3 uLandHot;
        uniform float uLandGlow;
        uniform float uLandExposure;
        uniform float uLandAlbedo;
        uniform float uOceanLift;
        varying vec3 vEarthLocalPos;`,
      )
      .replace(
        '#include <map_fragment>',
        `float earthLandMask = 0.0;
        float earthRelief = 0.0;
        vec3 earthLandTone = uLandColor;

        #ifdef USE_MAP
          vec4 earthTexel = texture2D(map, vMapUv);
          // El texel ya viene en espacio lineal (la textura es sRGB)
          float earthChroma = (earthTexel.r + earthTexel.g) * 0.5 - earthTexel.b;
          float earthLum = dot(earthTexel.rgb, vec3(0.2126, 0.7152, 0.0722));
          earthLandMask = max(
            smoothstep(-0.005, 0.03, earthChroma),
            smoothstep(0.3, 0.5, earthLum)
          );

          earthRelief = clamp(pow(earthLum, 0.75) * 1.25, 0.0, 1.0);
          #ifdef USE_BUMPMAP
            earthRelief = clamp(
              earthRelief + texture2D(bumpMap, vBumpMapUv).r * 0.5,
              0.0,
              1.0
            );
          #endif

          earthLandTone = mix(uLandColor, uLandHot, pow(earthRelief, 1.5));
          earthLandTone *= 1.0 + earthRelief * uLandExposure;

          vec3 earthOceanTone = uOceanColor * (uOceanLift + earthLum * 2.2);
          diffuseColor.rgb = mix(
            earthOceanTone,
            earthLandTone * uLandAlbedo,
            earthLandMask
          );
        #endif`,
      )
      .replace(
        '#include <emissivemap_fragment>',
        `#include <emissivemap_fragment>
        // Autoiluminación: la máscara sigue encendida en el terminador
        totalEmissiveRadiance += earthLandTone * earthLandMask * uLandGlow;

        #ifdef USE_MAP
          // Malla hexagonal superpuesta. Es un PNG de fondo negro, así que
          // en aditivo solo aporta el trazado.
          // El ángulo se mide sobre la esfera, no en pantalla: así el disco
          // se deforma con la curvatura en vez de flotar plano encima.
          float meshAngle = acos(
            clamp(dot(normalize(vEarthLocalPos), normalize(uMousePoint)), -1.0, 1.0)
          );
          float meshSpot =
            exp(-pow(meshAngle / uMeshRadius, 2.0)) * uMouseActive;
          float meshAlpha = uMeshOpacity * (uMeshBase + uMeshPeak * meshSpot);

          vec3 earthMesh = texture2D(uMeshMap, vMapUv + uMeshOffset).rgb;
          totalEmissiveRadiance += earthMesh * meshAlpha;
        #endif`,
      )
  }
  material.customProgramCacheKey = () => 'earth-neon-mask-v3'

  return {
    uniforms: styleUniforms,
    /** Cambia el sampler en caliente, sin recompilar el programa */
    setMeshMap(texture) {
      styleUniforms.uMeshMap.value = texture || blankMap
    },
    /** Para afinar el encuadre a ojo: (u, v) en fracción de textura */
    setMeshOffset(u, v) {
      styleUniforms.uMeshOffset.value.set(u, v)
    },
    setMeshOpacity(value) {
      styleUniforms.uMeshOpacity.value = Math.max(value, 0)
    },
    dispose() {
      blankMap.dispose()
    },
  }
}
