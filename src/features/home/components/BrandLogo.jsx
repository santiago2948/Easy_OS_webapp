/**
 * Easy Logistics — mark + wordmark oficiales.
 * Isotipo: marco · anillo · chevron encima (punta visible).
 */
import {
  BRAND_COLORS,
  MARK_CHEVRON,
  MARK_FRAME,
  MARK_RING,
  getMarkColors,
} from './brandMark'

export function BrandMark({ colors, size, className = 'brand-logo__mark' }) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 64 64"
      aria-hidden="true"
    >
      <rect
        x={MARK_FRAME.x}
        y={MARK_FRAME.y}
        width={MARK_FRAME.width}
        height={MARK_FRAME.height}
        rx={MARK_FRAME.rx}
        fill="none"
        stroke={colors.frame}
        strokeWidth={MARK_FRAME.strokeWidth}
      />
      <circle
        cx={MARK_RING.cx}
        cy={MARK_RING.cy}
        r={MARK_RING.r}
        fill="none"
        stroke={colors.ring}
        strokeWidth={MARK_RING.strokeWidth}
      />
      {colors.chevron ? (
        <path
          d={MARK_CHEVRON.d}
          fill="none"
          stroke={colors.chevron}
          strokeWidth={MARK_CHEVRON.strokeWidth}
          strokeLinecap={MARK_CHEVRON.strokeLinecap}
          strokeLinejoin={MARK_CHEVRON.strokeLinejoin}
          strokeMiterlimit={MARK_CHEVRON.strokeMiterlimit}
        />
      ) : null}
    </svg>
  )
}

export default function BrandLogo({
  variant = 'onDark',
  size = 'lg',
  showSubtitle = true,
  className = '',
}) {
  const isDark = variant === 'onDark'
  const ink = isDark ? BRAND_COLORS.white : BRAND_COLORS.navy
  const markColors = getMarkColors(variant)
  const markSize = size === 'lg' ? 70 : size === 'sm' ? 38 : 46

  return (
    <span className={`brand-logo brand-logo--${size} ${className}`.trim()}>
      <BrandMark colors={markColors} size={markSize} />
      <span className="brand-logo__text" style={{ color: ink }}>
        <span className="brand-logo__word">easy</span>
        {showSubtitle ? (
          <span className="brand-logo__sub">LOGISTICS COLOMBIA S.A.S</span>
        ) : null}
      </span>
    </span>
  )
}

export { BRAND_COLORS, MARK_CHEVRON, MARK_FRAME, MARK_RING, getMarkColors }
