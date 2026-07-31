/**
 * Easy Logistics — geometría oficial del isotipo.
 * Capas (abajo → arriba): marco · anillo · chevron encima (punta visible).
 *
 * Cuadrado 64×64 · marco stroke 5.5 centrado en x=4,y=4,w=56.
 * Borde interior del marco a 7.75 px del viewBox (half = 25.25 desde centro).
 * Anillo: borde exterior tangente al borde interior del marco → r = 22.5.
 * Chevron: punta visible (miter) tangente al borde interior del hueco (ri = 19.75).
 */
export const BRAND_COLORS = {
  cyan: '#00A4BD',
  navy: '#003D4C',
  white: '#FFFFFF',
}

const STROKE = 5.5
const HALF_STROKE = STROKE / 2
const CENTER = 32
/** Mitad del lado interior del marco (56 − stroke) / 2 */
const FRAME_INNER_HALF = (56 - STROKE) / 2

export const MARK_FRAME = {
  x: 4,
  y: 4,
  width: 56,
  height: 56,
  rx: 2.5,
  strokeWidth: STROKE,
}

/** r tal que el trazo exterior del anillo toca el borde interior del marco */
export const MARK_RING = {
  cx: CENTER,
  cy: CENTER,
  r: FRAME_INNER_HALF - HALF_STROKE,
  strokeWidth: STROKE,
}

/** Radio interior del anillo (borde interior del hueco) */
const RING_INNER_R = MARK_RING.r - HALF_STROKE

/** Y del borde interior superior del anillo (hueco) */
const RING_INNER_TOP_Y = CENTER - RING_INNER_R

const toRad = (deg) => (deg * Math.PI) / 180
const round = (n) => Math.round(n * 100) / 100

/** Extremos de la V sobre el borde interior del anillo (sin línea horizontal) */
const chevronLeftX = round(CENTER + RING_INNER_R * Math.cos(toRad(135)))
const chevronLeftY = round(CENTER + RING_INNER_R * Math.sin(toRad(135)))
const chevronRightX = round(CENTER + RING_INNER_R * Math.cos(toRad(45)))
const chevronRightY = round(CENTER + RING_INNER_R * Math.sin(toRad(45)))

/** Prolongación del miter exterior desde el vértice del trazo */
function chevronMiterOut(apexY) {
  const toLeftX = chevronLeftX - CENTER
  const toLeftY = chevronLeftY - apexY
  const toRightX = chevronRightX - CENTER
  const toRightY = chevronRightY - apexY
  const dot = toLeftX * toRightX + toLeftY * toRightY
  const mag1 = Math.hypot(toLeftX, toLeftY)
  const mag2 = Math.hypot(toRightX, toRightY)
  const theta = Math.acos(Math.max(-1, Math.min(1, dot / (mag1 * mag2))))
  return HALF_STROKE / Math.sin(theta / 2)
}

/** Vértice del trazo: la punta visible toca el borde interior, no el exterior */
function solveChevronApexY() {
  let lo = RING_INNER_TOP_Y
  let hi = CENTER
  for (let i = 0; i < 64; i += 1) {
    const mid = (lo + hi) / 2
    const tipY = mid - chevronMiterOut(mid)
    if (tipY > RING_INNER_TOP_Y) hi = mid
    else lo = mid
  }
  return round((lo + hi) / 2)
}

const CHEVRON_APEX_Y = solveChevronApexY()

/** Chevron · V invertida · punta visible en borde interior del hueco */
export const MARK_CHEVRON = {
  d: `M${chevronLeftX} ${chevronLeftY} L${CENTER} ${CHEVRON_APEX_Y} L${chevronRightX} ${chevronRightY}`,
  strokeWidth: STROKE,
  strokeLinecap: 'butt',
  strokeLinejoin: 'miter',
  strokeMiterlimit: 15,
}

/** Lockup completo · fondos oscuros */
export function getMarkColorsOnDark() {
  return {
    frame: BRAND_COLORS.cyan,
    ring: BRAND_COLORS.white,
    chevron: BRAND_COLORS.cyan,
  }
}

/** Lockup completo · fondos claros */
export function getMarkColorsOnLight() {
  return {
    frame: BRAND_COLORS.navy,
    ring: BRAND_COLORS.cyan,
    chevron: BRAND_COLORS.navy,
  }
}

export function getMarkColors(variant = 'onDark') {
  return variant === 'onLight' ? getMarkColorsOnLight() : getMarkColorsOnDark()
}
