import { useCallback, useEffect, useRef, useState } from 'react'
import { METHOD } from '../content/landingNarrative'

/**
 * Paneles expansibles “Por qué Easy”: acordeón cinematográfico
 * en lugar de carrusel de tarjetas.
 */
export default function MethodReel() {
  const slides = METHOD.slides
  const [active, setActive] = useState(0)
  const rootRef = useRef(null)

  const go = useCallback(
    (dir) => {
      setActive((i) => (i + dir + slides.length) % slides.length)
    },
    [slides.length],
  )

  useEffect(() => {
    const root = rootRef.current
    if (!root) return undefined

    const onKey = (e) => {
      if (!root.contains(document.activeElement)) return
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        e.preventDefault()
        go(1)
      }
      if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault()
        go(-1)
      }
    }

    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [go])

  const canHover = () =>
    typeof window !== 'undefined' &&
    window.matchMedia('(hover: hover) and (min-width: 900px)').matches

  return (
    <div className="lp-method-reel" ref={rootRef}>
      <div className="lp-method-reel__scan" aria-hidden="true" />

      <div className="lp-method-reel__panels" role="tablist" aria-label="Por qué Easy">
        {slides.map((slide, i) => {
          const isActive = i === active
          return (
            <button
              key={slide.id}
              type="button"
              role="tab"
              id={`method-tab-${slide.id}`}
              aria-selected={isActive}
              aria-controls={`method-panel-${slide.id}`}
              className={`lp-method-reel__panel${isActive ? ' is-active' : ''}`}
              onMouseEnter={() => canHover() && setActive(i)}
              onFocus={() => setActive(i)}
              onClick={() => setActive(i)}
            >
              <div
                className="lp-method-reel__media"
                aria-hidden="true"
                style={{ backgroundImage: slide.img ? `url(${slide.img})` : undefined }}
              />
              <div className="lp-method-reel__veil" aria-hidden="true" />
              <div className="lp-method-reel__glow" aria-hidden="true" />

              <span className="lp-method-reel__index" aria-hidden="true">
                {String(i + 1).padStart(2, '0')}
              </span>
              <span className="lp-method-reel__tab">{slide.label}</span>

              <div
                id={`method-panel-${slide.id}`}
                role="tabpanel"
                aria-labelledby={`method-tab-${slide.id}`}
                className="lp-method-reel__body"
                hidden={!isActive}
              >
                <p className="lp-method-reel__label">{slide.label}</p>
                <h3>{slide.title}</h3>
                <p>{slide.body}</p>
              </div>
            </button>
          )
        })}
      </div>

      <div className="lp-method-reel__foot" aria-hidden="true">
        <div className="lp-method-reel__progress">
          {slides.map((s, i) => (
            <span
              key={s.id}
              className={`lp-method-reel__tick${i === active ? ' is-active' : ''}${i < active ? ' is-past' : ''}`}
            />
          ))}
        </div>
        <span className="lp-method-reel__count">
          {String(active + 1).padStart(2, '0')} / {String(slides.length).padStart(2, '0')}
        </span>
      </div>
    </div>
  )
}
