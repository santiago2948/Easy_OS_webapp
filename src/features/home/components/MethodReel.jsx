import { useCallback, useEffect, useRef, useState } from 'react'
import { METHOD } from '../content/landingNarrative'
import { preloadImage, preloadImages } from '../utils/preloadImage'

const AUTO_ADVANCE_MS = 5000

/**
 * Paneles expansibles “Por qué Easy”: acordeón cinematográfico
 * en lugar de carrusel de tarjetas.
 */
export default function MethodReel() {
  const slides = METHOD.slides
  const [active, setActive] = useState(0)
  const [paused, setPaused] = useState(false)
  const [loadedSlides, setLoadedSlides] = useState(() => new Set())
  const rootRef = useRef(null)
  const inViewRef = useRef(true)

  const markLoaded = useCallback((slideId) => {
    setLoadedSlides((current) => {
      if (current.has(slideId)) return current
      const next = new Set(current)
      next.add(slideId)
      return next
    })
  }, [])

  const go = useCallback(
    (dir) => {
      setActive((i) => (i + dir + slides.length) % slides.length)
    },
    [slides.length],
  )

  const selectSlide = useCallback((index) => {
    setActive(index)
  }, [])

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

  useEffect(() => {
    const root = rootRef.current
    if (!root || typeof IntersectionObserver === 'undefined') return undefined

    let cancelled = false

    const observer = new IntersectionObserver(
      ([entry]) => {
        inViewRef.current = entry.isIntersecting
        if (!entry.isIntersecting || cancelled) return

        const first = slides[0]
        preloadImage(first.img)
          .then(() => markLoaded(first.id))
          .catch(() => markLoaded(first.id))

        const rest = slides.slice(1).map((slide) => slide.img)
        const schedule = () => {
          preloadImages(rest, { staggerMs: 80 }).then(() => {
            if (cancelled) return
            slides.slice(1).forEach((slide) => markLoaded(slide.id))
          })
        }

        if (typeof window.requestIdleCallback === 'function') {
          window.requestIdleCallback(schedule, { timeout: 1200 })
        } else {
          window.setTimeout(schedule, 200)
        }
      },
      { threshold: 0.05, rootMargin: '480px 0px' },
    )

    observer.observe(root)
    return () => {
      cancelled = true
      observer.disconnect()
    }
  }, [markLoaded, slides])

  useEffect(() => {
    const slide = slides[active]
    if (!slide || loadedSlides.has(slide.id)) return undefined

    let cancelled = false
    preloadImage(slide.img)
      .then(() => {
        if (!cancelled) markLoaded(slide.id)
      })
      .catch(() => {
        if (!cancelled) markLoaded(slide.id)
      })

    return () => {
      cancelled = true
    }
  }, [active, loadedSlides, markLoaded, slides])

  useEffect(() => {
    if (paused) return undefined
    if (
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      return undefined
    }

    const timer = window.setInterval(() => {
      if (!inViewRef.current) return
      go(1)
    }, AUTO_ADVANCE_MS)

    return () => window.clearInterval(timer)
  }, [go, paused, active])

  const canHover = () =>
    typeof window !== 'undefined' &&
    window.matchMedia('(hover: hover) and (min-width: 900px)').matches

  return (
    <div
      className="lp-method-reel"
      ref={rootRef}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) {
          setPaused(false)
        }
      }}
    >
      <div className="lp-method-reel__scan" aria-hidden="true" />

      <div className="lp-method-reel__panels" role="tablist" aria-label="Por qué Easy">
        {slides.map((slide, i) => {
          const isActive = i === active
          const isLoaded = loadedSlides.has(slide.id)
          return (
            <button
              key={slide.id}
              type="button"
              role="tab"
              id={`method-tab-${slide.id}`}
              aria-selected={isActive}
              aria-controls={`method-panel-${slide.id}`}
              className={`lp-method-reel__panel${isActive ? ' is-active' : ''}`}
              onMouseEnter={() => canHover() && selectSlide(i)}
              onFocus={() => selectSlide(i)}
              onClick={() => selectSlide(i)}
            >
              <div
                className={`lp-method-reel__media${isLoaded ? ' is-loaded' : ''}`}
                aria-hidden="true"
              >
                {isLoaded ? (
                  <picture>
                    <source srcSet={slide.img} type="image/webp" />
                    <img
                      src={slide.imgFallback || slide.img}
                      alt=""
                      decoding="async"
                      loading="lazy"
                      draggable={false}
                    />
                  </picture>
                ) : null}
              </div>
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
