import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useLandingCopy } from '../content/landingNarrative'

gsap.registerPlugin(ScrollTrigger)

import { BRAND_COLORS, MARK_CHEVRON, MARK_FRAME, MARK_RING } from './brandMark'

const LETTERS = ['e', 'a', 's', 'y']

export default function BrandAssembly({
  variant = 'hero',
  pinEnd = '+=320%',
  triggerSelector = '.orbit-hero',
}) {
  const copy = useLandingCopy()
  const rootRef = useRef(null)
  const frameRef = useRef(null)
  const discRef = useRef(null)
  const chevronRef = useRef(null)
  const wordRef = useRef(null)
  const letterRefs = useRef([])
  const subRef = useRef(null)
  const lineRef = useRef(null)

  const isHero = variant === 'hero'

  useEffect(() => {
    const root = rootRef.current
    if (!root) return undefined

    const trigger =
      document.querySelector(triggerSelector) || root.closest('.orbit-hero') || root

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const frame = frameRef.current
    const disc = discRef.current
    const chevron = chevronRef.current
    const letters = letterRefs.current.filter(Boolean)
    const sub = subRef.current
    const line = lineRef.current
    const word = wordRef.current

    if (!frame || !disc || !chevron || !sub || !line || !word) return undefined

    if (reduce) {
      gsap.set(root, { opacity: 1 })
      gsap.set([frame, disc, chevron, word, sub, line, ...letters], {
        opacity: 1,
        x: 0,
        y: 0,
        rotate: 0,
        scale: 1,
      })
      return undefined
    }

    const ctx = gsap.context(() => {
      gsap.set(root, { opacity: 1 })
      gsap.set([frame, disc, chevron, word, sub, line, ...letters], {
        opacity: 0,
      })
      gsap.set([frame, disc, chevron], { transformOrigin: 'center center', transformBox: 'fill-box' })

      if (isHero) {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger,
            start: 'top top',
            end: pinEnd,
            scrub: 0.75,
          },
        })

        tl.fromTo(
          frame,
          { x: -76, y: -52, opacity: 0, rotate: -20 },
          { x: 0, y: 0, opacity: 1, rotate: 0, ease: 'power2.out', duration: 0.08 },
          0.7,
        )
        tl.fromTo(
          disc,
          { y: 92, opacity: 0, scale: 0.5 },
          { y: 0, opacity: 1, scale: 1, ease: 'power2.out', duration: 0.08 },
          0.72,
        )
        tl.fromTo(
          chevron,
          { x: 68, y: 42, opacity: 0, rotate: 28, scale: 0.8 },
          { x: 0, y: 0, opacity: 1, rotate: 0, scale: 1, ease: 'power2.out', duration: 0.08 },
          0.74,
        )
        tl.fromTo(word, { opacity: 0 }, { opacity: 1, duration: 0.02 }, 0.8)
        tl.fromTo(
          letters,
          { x: (index) => 24 + index * 8, y: 22, opacity: 0 },
          {
            x: 0,
            y: 0,
            opacity: 1,
            stagger: 0.012,
            ease: 'power3.out',
            duration: 0.05,
          },
          0.81,
        )
        tl.fromTo(
          sub,
          { opacity: 0, y: 14 },
          { opacity: 0.88, y: 0, ease: 'power2.out', duration: 0.04 },
          0.88,
        )
        tl.fromTo(
          line,
          { opacity: 0, y: 18 },
          { opacity: 1, y: 0, ease: 'power2.out', duration: 0.04 },
          0.91,
        )
        tl.to(root, { opacity: 0, ease: 'power2.in', duration: 0.05 }, 0.97)
        return
      }

      const mobile = window.matchMedia('(max-width: 768px)').matches

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: root,
          start: 'top top',
          end: mobile ? '+=55%' : '+=80%',
          scrub: 0.75,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      })

      tl.fromTo(
        frame,
        { x: -76, y: -52, opacity: 0, rotate: -20 },
        { x: 0, y: 0, opacity: 1, rotate: 0, ease: 'power2.out', duration: 0.38 },
        0,
      )
      tl.fromTo(
        disc,
        { y: 92, opacity: 0, scale: 0.5 },
        { y: 0, opacity: 1, scale: 1, ease: 'power2.out', duration: 0.38 },
        0.03,
      )
      tl.fromTo(
        chevron,
        { x: 68, y: 42, opacity: 0, rotate: 28, scale: 0.8 },
        { x: 0, y: 0, opacity: 1, rotate: 0, scale: 1, ease: 'power2.out', duration: 0.38 },
        0.06,
      )
      tl.fromTo(word, { opacity: 0 }, { opacity: 1, duration: 0.08 }, 0.42)
      tl.fromTo(
        letters,
        { x: (index) => 24 + index * 8, y: 22, opacity: 0 },
        {
          x: 0,
          y: 0,
          opacity: 1,
          stagger: 0.05,
          ease: 'power3.out',
          duration: 0.24,
        },
        0.44,
      )
      tl.fromTo(
        sub,
        { opacity: 0, y: 14 },
        { opacity: 0.88, y: 0, ease: 'power2.out', duration: 0.22 },
        0.62,
      )
      tl.fromTo(
        line,
        { opacity: 0, y: 18 },
        { opacity: 1, y: 0, ease: 'power2.out', duration: 0.24 },
        0.72,
      )
    }, root)

    return () => ctx.revert()
  }, [isHero, pinEnd, triggerSelector])

  const Tag = isHero ? 'div' : 'section'

  return (
    <Tag
      className={`lp-brand-assembly${isHero ? ' lp-brand-assembly--hero' : ''}`}
      ref={rootRef}
      aria-label="Easy Logistics Colombia"
      aria-hidden={isHero ? true : undefined}
    >
      <div className="lp-brand-assembly__glow" aria-hidden="true" />

      <div className="lp-brand-assembly__inner">
        <div className="lp-brand-assembly__lockup">
          <svg
            className="lp-brand-assembly__mark"
            viewBox="0 0 64 64"
            aria-hidden="true"
          >
            <g ref={frameRef} className="lp-brand-assembly__part">
              <rect
                x={MARK_FRAME.x}
                y={MARK_FRAME.y}
                width={MARK_FRAME.width}
                height={MARK_FRAME.height}
                rx={MARK_FRAME.rx}
                fill="none"
                stroke={BRAND_COLORS.cyan}
                strokeWidth={MARK_FRAME.strokeWidth}
              />
            </g>
            <g ref={discRef} className="lp-brand-assembly__part">
              <circle
                cx={MARK_RING.cx}
                cy={MARK_RING.cy}
                r={MARK_RING.r}
                fill="none"
                stroke={BRAND_COLORS.white}
                strokeWidth={MARK_RING.strokeWidth}
              />
            </g>
            <g ref={chevronRef} className="lp-brand-assembly__part">
              <path
                d={MARK_CHEVRON.d}
                fill="none"
                stroke={BRAND_COLORS.cyan}
                strokeWidth={MARK_CHEVRON.strokeWidth}
                strokeLinecap={MARK_CHEVRON.strokeLinecap}
                strokeLinejoin={MARK_CHEVRON.strokeLinejoin}
                strokeMiterlimit={MARK_CHEVRON.strokeMiterlimit}
              />
            </g>
          </svg>

          <div className="lp-brand-assembly__text">
            <p className="lp-brand-assembly__word" ref={wordRef} aria-hidden="true">
              {LETTERS.map((letter, index) => (
                <span
                  key={letter + index}
                  ref={(node) => {
                    letterRefs.current[index] = node
                  }}
                  className="lp-brand-assembly__letter"
                >
                  {letter}
                </span>
              ))}
            </p>
            <span className="visually-hidden">easy</span>
            <span className="lp-brand-assembly__sub" ref={subRef}>
              LOGISTICS COLOMBIA S.A.S
            </span>
          </div>
        </div>

        <p className="lp-brand-assembly__line" ref={lineRef}>
          {copy.brandAssembly.line}
        </p>
      </div>
    </Tag>
  )
}
