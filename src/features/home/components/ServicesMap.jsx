import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useLandingCopy } from '../content/landingNarrative'
import { TrustCoverage } from './TrustCoverage'

gsap.registerPlugin(ScrollTrigger)

const PHASE_ICONS = {
  origen: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="1.2" />
      <path d="M12 3v18M3 12h18" stroke="currentColor" strokeWidth="1" opacity="0.45" />
    </svg>
  ),
  transito: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M3 17h18M5 17l2-8h10l2 8M8 9V6h8v3"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
    </svg>
  ),
  destino: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M12 21s7-4.5 7-11a7 7 0 1 0-14 0c0 6.5 7 11 7 11z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.2"
      />
      <circle cx="12" cy="10" r="2.2" fill="currentColor" />
    </svg>
  ),
  express: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M13 2L4 14h7l-1 8 9-12h-7l1-8z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
    </svg>
  ),
}

/**
 * Mapa visual de servicios con ruta que se dibuja al scroll.
 */
export function ServicesMap() {
  const { services } = useLandingCopy()
  const rootRef = useRef(null)
  const pathRef = useRef(null)

  useEffect(() => {
    const root = rootRef.current
    const path = pathRef.current
    if (!root || !path) return undefined

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const len = path.getTotalLength()
    path.style.strokeDasharray = `${len}`
    path.style.strokeDashoffset = `${len}`

    if (reduce) {
      path.style.strokeDashoffset = '0'
      return undefined
    }

    const ctx = gsap.context(() => {
      gsap.to(path, {
        strokeDashoffset: 0,
        ease: 'none',
        scrollTrigger: {
          trigger: root,
          start: 'top 72%',
          end: 'bottom 55%',
          scrub: 0.85,
        },
      })

      gsap.fromTo(
        '.lp-services-map__route-node',
        { scale: 0.6, opacity: 0.35 },
        {
          scale: 1,
          opacity: 1,
          stagger: 0.12,
          duration: 0.45,
          ease: 'back.out(1.6)',
          scrollTrigger: {
            trigger: root,
            start: 'top 68%',
            toggleActions: 'play none none reverse',
          },
        },
      )
    }, root)

    return () => ctx.revert()
  }, [])

  return (
    <div className="lp-services-map" ref={rootRef}>
      <div className="lp-services-map__head" data-rise>
        <p className="lp-recognize__label">{services.kicker}</p>
        <h2>{services.title}</h2>
        <p className="lp-services-map__lead">{services.lead}</p>
      </div>

      <TrustCoverage />

      <div className="lp-services-map__route" aria-hidden="true">
        <svg className="lp-services-map__route-svg" viewBox="0 0 1000 24" preserveAspectRatio="none">
          <path
            ref={pathRef}
            className="lp-services-map__route-path"
            d="M 20 12 H 260 Q 330 12, 370 12 H 630 Q 700 12, 740 12 H 980"
            fill="none"
            stroke="url(#servicesRouteGrad)"
            strokeWidth="2"
          />
          <defs>
            <linearGradient id="servicesRouteGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#00e5ff" stopOpacity="0.25" />
              <stop offset="50%" stopColor="#00e5ff" stopOpacity="1" />
              <stop offset="100%" stopColor="#5ef8ff" stopOpacity="0.55" />
            </linearGradient>
          </defs>
        </svg>
        {services.phases.map((phase, i) => (
          <span
            key={phase.id}
            className="lp-services-map__route-node"
            style={{ '--node-i': i }}
          />
        ))}
      </div>

      <ol className="lp-services-map__phases">
        {services.phases.map((phase) => (
          <li key={phase.id} className="lp-services-map__phase" data-rise>
            <div className="lp-services-map__phase-head">
              <span className="lp-services-map__phase-icon">
                {PHASE_ICONS[phase.id]}
              </span>
              <div>
                <p className="lp-services-map__phase-label">{phase.label}</p>
                <p className="lp-services-map__phase-tag">{phase.tag}</p>
              </div>
            </div>
            <ul className="lp-services-map__list">
              {phase.items.map((item) => (
                <li key={item.t} className="lp-services-map__item">
                  <span className="lp-services-map__item-dot" aria-hidden="true" />
                  <div>
                    <h3>{item.t}</h3>
                    <p>{item.d}</p>
                  </div>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ol>

      <p className="lp-services-map__note" data-rise>
        {services.note}
      </p>
    </div>
  )
}
