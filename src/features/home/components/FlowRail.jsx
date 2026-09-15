import { useEffect, useId, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { CONTACT, QUOTE_PATH, useLandingCopy } from '../content/landingNarrative'

gsap.registerPlugin(ScrollTrigger)

/**
 * Timeline de flujo + línea animada + CTA expandible.
 */
export function FlowRail({ id, kicker, title, subtitle, steps, cta, contact }) {
  const copy = useLandingCopy()
  const [open, setOpen] = useState(false)
  const panelId = useId()
  const sectionRef = useRef(null)
  const lineRef = useRef(null)

  useEffect(() => {
    const section = sectionRef.current
    const line = lineRef.current
    if (!section || !line) return undefined

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const len = line.getTotalLength()
    line.style.strokeDasharray = `${len}`
    line.style.strokeDashoffset = `${len}`

    if (reduce) {
      line.style.strokeDashoffset = '0'
      return undefined
    }

    const ctx = gsap.context(() => {
      gsap.to(line, {
        strokeDashoffset: 0,
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top 70%',
          end: 'center 45%',
          scrub: 0.75,
        },
      })
    }, section)

    return () => ctx.revert()
  }, [steps.length])

  return (
    <section ref={sectionRef} id={id} className="lp-flow-rail lp-flow-rail--fin lp-section">
      <div className="lp-flow-rail__head lp-section__head" data-rise>
        <p className="lp-recognize__label">{kicker}</p>
        <h2>{title}</h2>
        {subtitle && <p className="lp-section__lead">{subtitle}</p>}
      </div>

      <div className="lp-flow-rail__timeline-wrap">
        <svg
          className="lp-flow-rail__timeline"
          viewBox="0 0 1000 12"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path
            ref={lineRef}
            className="lp-flow-rail__timeline-path"
            d="M 16 6 H 984"
            fill="none"
            stroke="url(#flowLineGrad)"
            strokeWidth="2"
          />
          <defs>
            <linearGradient id="flowLineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#00e5ff" stopOpacity="0.45" />
              <stop offset="100%" stopColor="#00e5ff" stopOpacity="1" />
            </linearGradient>
          </defs>
        </svg>

        <ol className="lp-flow-rail__track">
          {steps.map((step, i) => (
            <li
              key={step.n}
              className="lp-flow-rail__card"
              style={{ '--card-i': i }}
              data-rise
            >
              <span className="lp-flow-rail__n">{step.n}</span>
              <div className="lp-flow-rail__card-body">
                <h3>{step.t}</h3>
                <p>{step.d}</p>
              </div>
              <div className="lp-flow-rail__pulse" aria-hidden="true" />
            </li>
          ))}
        </ol>
      </div>

      {cta && contact && (
        <div className="lp-flow-rail__cta" data-rise>
          <button
            type="button"
            className={`btn btn--ghost btn--ghost-light lp-flow-rail__toggle${open ? ' is-active' : ''}`}
            aria-expanded={open}
            aria-controls={panelId}
            onClick={() => setOpen((prev) => !prev)}
          >
            {cta.label}
          </button>

          <div
            id={panelId}
            className={`lp-flow-rail__contact${open ? ' is-open' : ''}`}
            aria-hidden={!open}
          >
            <div className="lp-flow-rail__contact-panel">
              <Link to={QUOTE_PATH} className="btn btn--primary lp-flow-rail__quote">
                {copy.ui.quote}
              </Link>
              <a
                href={CONTACT.whatsapp}
                className="btn btn--ghost btn--ghost-light lp-flow-rail__whatsapp"
                target="_blank"
                rel="noreferrer"
              >
                {contact.whatsapp}
              </a>
              <div className="lp-flow-rail__contact-alt">
                <a href={CONTACT.email} className="lp-flow-rail__link">
                  {contact.email}
                </a>
                <span className="lp-flow-rail__sep" aria-hidden="true">
                  ·
                </span>
                <a href={CONTACT.phone} className="lp-flow-rail__link">
                  {contact.phone}
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
