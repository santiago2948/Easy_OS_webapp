import { useLandingCopy } from '../content/landingNarrative'

/**
 * Red animada de rutas marítimas y aéreas hacia Colombia.
 * Interludio visual post-hero.
 */
export function RouteMesh() {
  const { routeTags } = useLandingCopy()
  const tags = [...routeTags, ...routeTags]

  return (
    <div className="lp-route-mesh" aria-hidden="true">
      <div className="lp-route-mesh__glow" />
      <svg
        className="lp-route-mesh__svg"
        viewBox="0 0 1200 320"
        preserveAspectRatio="xMidYMid slice"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="routeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#00e5ff" stopOpacity="0" />
            <stop offset="45%" stopColor="#00e5ff" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#5ef8ff" stopOpacity="0.45" />
          </linearGradient>
          <filter id="routeGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <g className="lp-route-mesh__lines" filter="url(#routeGlow)">
          <path
            className="lp-route-mesh__arc lp-route-mesh__arc--1"
            d="M 80 180 Q 320 40, 580 155 T 920 120"
            fill="none"
            stroke="url(#routeGrad)"
            strokeWidth="1.2"
          />
          <path
            className="lp-route-mesh__arc lp-route-mesh__arc--2"
            d="M 120 240 Q 400 80, 620 200 T 1080 160"
            fill="none"
            stroke="url(#routeGrad)"
            strokeWidth="1"
          />
          <path
            className="lp-route-mesh__arc lp-route-mesh__arc--3"
            d="M 60 100 Q 280 200, 520 130 T 860 90"
            fill="none"
            stroke="url(#routeGrad)"
            strokeWidth="0.9"
          />
        </g>

        <g className="lp-route-mesh__nodes">
          <g className="lp-route-mesh__hub-wrap">
            <circle className="lp-route-mesh__node lp-route-mesh__node--hub" cx="620" cy="175" r="6" />
          </g>
          <circle className="lp-route-mesh__node" cx="920" cy="120" r="3.5" />
          <circle className="lp-route-mesh__node" cx="1080" cy="160" r="3" />
          <circle className="lp-route-mesh__node" cx="860" cy="90" r="3" />
          <circle className="lp-route-mesh__node" cx="80" cy="180" r="3" />
          <circle className="lp-route-mesh__node" cx="120" cy="240" r="3" />
        </g>
      </svg>

      <div className="lp-route-mesh__tags">
        {tags.map((tag, index) => (
          <span key={`${tag}-${index}`}>{tag}</span>
        ))}
      </div>
    </div>
  )
}
