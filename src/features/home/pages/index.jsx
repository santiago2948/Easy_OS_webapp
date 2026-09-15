import { lazy, Suspense, useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'
import LearnMorePanel from '../components/LearnMorePanel'
import SuccessStoriesMarquee from '../components/SuccessStoriesMarquee'
import FaqSection from '../components/FaqSection'
import BrandLogo from '../components/BrandLogo'
import {
  CONTACT,
  METHOD_MEDIA,
  QUOTE_PATH,
  SECTION_IDS,
  useLandingCopy,
} from '../content/landingNarrative'
import { useLangPath, useLanguage } from '../../../i18n/LanguageContext'
import { useSeo, SITE_URL } from '../../../seo/useSeo'
import { buildHomeSchema } from '../../../seo/schema'
import '../styles/landing.css'
import '../styles/orbit.css'

const GlobeOrbit = lazy(() => import('../components/GlobeOrbit'))
const BrandAssembly = lazy(() => import('../components/BrandAssembly'))
const MethodReel = lazy(() => import('../components/MethodReel'))
const FlowRail = lazy(() =>
  import('../components/FlowRail').then((m) => ({ default: m.FlowRail })),
)
const RouteMesh = lazy(() =>
  import('../components/RouteMesh').then((m) => ({ default: m.RouteMesh })),
)

function getEarthTextureUrls() {
  const mobile = window.matchMedia('(max-width: 768px)').matches
  const tablet = window.matchMedia('(max-width: 1200px)').matches
  if (mobile) {
    return {
      day: '/media/earth-day-sm.jpg',
      topo: '/media/earth-topo-sm.jpg',
    }
  }
  if (tablet) {
    return {
      day: '/media/earth-day-lg.jpg',
      topo: '/media/earth-topo-lg.jpg',
    }
  }
  return {
    day: '/media/earth-day-xl.jpg',
    topo: '/media/earth-topo-lg.jpg',
  }
}

function preloadGlobeTextures() {
  const { day, topo } = getEarthTextureUrls()
  for (const href of [day, topo]) {
    if (document.querySelector(`link[rel="preload"][href="${href}"]`)) continue
    const link = document.createElement('link')
    link.rel = 'preload'
    link.as = 'image'
    link.href = href
    document.head.appendChild(link)
  }
  void import('three')
}

export default function Home() {
  const copy = useLandingCopy()
  const langPath = useLangPath()
  const { lang } = useLanguage()
  const rootRef = useRef(null)

  const schema = useMemo(
    () =>
      buildHomeSchema({
        copy,
        lang,
        contact: CONTACT,
        pageUrl: lang === 'en' ? `${SITE_URL}/en` : `${SITE_URL}/`,
      }),
    [copy, lang],
  )

  useSeo({
    lang,
    title: copy.seo.home.title,
    description: copy.seo.home.description,
    canonicalPath: '/',
    schema,
  })
  const [showGlobe, setShowGlobe] = useState(false)
  const [showBrandAssembly, setShowBrandAssembly] = useState(false)

  useEffect(() => {
    preloadGlobeTextures()

    const frameId = window.requestAnimationFrame(() => {
      setShowGlobe(true)
      setShowBrandAssembly(true)
    })

    return () => window.cancelAnimationFrame(frameId)
  }, [])

  useEffect(() => {
    const section = document.getElementById(SECTION_IDS.method)
    if (!section || typeof IntersectionObserver === 'undefined') return undefined

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        Object.values(METHOD_MEDIA).forEach(({ img }) => {
          if (!img) return
          if (document.querySelector(`link[rel="preload"][href="${img}"]`)) return
          const link = document.createElement('link')
          link.rel = 'preload'
          link.as = 'image'
          link.href = img
          document.head.appendChild(link)
        })
        observer.disconnect()
      },
      { rootMargin: '640px 0px' },
    )

    observer.observe(section)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const root = rootRef.current
    if (!root) return undefined

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) return undefined

    let ctx
    let cancelled = false

    Promise.all([import('gsap'), import('gsap/ScrollTrigger')]).then(
      ([{ default: gsap }, { ScrollTrigger }]) => {
        if (cancelled) return
        gsap.registerPlugin(ScrollTrigger)

        ctx = gsap.context(() => {
          gsap.utils.toArray('[data-rise]').forEach((el) => {
            gsap.fromTo(
              el,
              { y: 36, opacity: 0 },
              {
                y: 0,
                opacity: 1,
                duration: 0.8,
                ease: 'power3.out',
                scrollTrigger: {
                  trigger: el,
                  start: 'top 88%',
                  toggleActions: 'play none none reverse',
                },
              },
            )
          })

          gsap.fromTo(
            '.lp-method__empathy',
            { y: 48, opacity: 0, clipPath: 'inset(0 0 100% 0)' },
            {
              y: 0,
              opacity: 1,
              clipPath: 'inset(0 0 0% 0)',
              duration: 1,
              ease: 'power3.out',
              scrollTrigger: {
                trigger: '.lp-method__intro',
                start: 'top 78%',
                toggleActions: 'play none none reverse',
              },
            },
          )

          gsap.fromTo(
            '.lp-flow-rail__card',
            { y: 24, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              stagger: 0.08,
              duration: 0.55,
              ease: 'power2.out',
              scrollTrigger: {
                trigger: '.lp-flow-rail__track',
                start: 'top 78%',
                toggleActions: 'play none none reverse',
              },
            },
          )

          gsap.fromTo(
            '.lp-trust__card',
            { y: 24, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              stagger: 0.1,
              duration: 0.55,
              ease: 'power2.out',
              scrollTrigger: {
                trigger: '.lp-trust__grid',
                start: 'top 75%',
                toggleActions: 'play none none reverse',
              },
            },
          )
        }, root)
      },
    )

    return () => {
      cancelled = true
      ctx?.revert()
    }
  }, [])

  return (
    <div className="orbit-page" ref={rootRef}>
      <Header />

      <main>
        {/* 0 · Hero: globo intocable */}
        <section className="orbit-hero" id={SECTION_IDS.hero}>
          {showGlobe ? (
            <Suspense
              fallback={
                <div className="globe-orbit globe-orbit--fallback" aria-hidden="true" />
              }
            >
              <GlobeOrbit pinEnd="+=320%" />
            </Suspense>
          ) : (
            <div className="globe-orbit globe-orbit--fallback" aria-hidden="true" />
          )}

          <div className="orbit-hero__copy">
            <p className="orbit-kicker">{copy.hero.kicker}</p>
            <BrandLogo variant="onDark" size="lg" showSubtitle={false} />
            <h1>
              {copy.hero.title}
              <span>{copy.hero.titleAccent}</span>
            </h1>
            <p className="orbit-lead">{copy.hero.lead}</p>
            <div className="orbit-actions">
              <Link to={langPath(QUOTE_PATH)} className="btn btn--primary">
                {copy.hero.ctaQuote}
              </Link>
              <a
                href={CONTACT.whatsapp}
                className="btn btn--ghost btn--ghost-light"
                target="_blank"
                rel="noreferrer"
              >
                {copy.hero.ctaSecondary}
              </a>
            </div>
          </div>

          <p className="orbit-hero__hint" aria-hidden="true">
            {copy.hero.hint}
          </p>

          <div className="orbit-hero__exit-veil" aria-hidden="true" />
          {showBrandAssembly && (
            <Suspense fallback={null}>
              <BrandAssembly variant="hero" pinEnd="+=320%" />
            </Suspense>
          )}
        </section>

        {/* 1 · Cómo trabajamos */}
        <Suspense fallback={null}>
          <FlowRail
            id={SECTION_IDS.flow}
            kicker={copy.flow.kicker}
            title={copy.flow.title}
            subtitle={copy.flow.subtitle}
            steps={copy.flow.steps}
            cta={{ label: copy.flow.ctaSoft }}
            contact={copy.flow.contact}
          />
        </Suspense>

        <Suspense fallback={null}>
          <RouteMesh />
        </Suspense>

        {/* 2 · Método Easy */}
        <section className="lp-section lp-method" id={SECTION_IDS.method}>
          <div className="lp-method__intro" data-rise>
            <p className="orbit-kicker">{copy.method.kicker}</p>
            <p className="lp-method__empathy">{copy.method.empathy}</p>
            <p className="lp-method__lead">{copy.method.intro}</p>
          </div>
          <div data-rise>
            <Suspense fallback={null}>
              <MethodReel />
            </Suspense>
          </div>
        </section>

        <SuccessStoriesMarquee />

        <FaqSection />

        {/* 3 · Confianza */}
        <section className="lp-section lp-trust" id={SECTION_IDS.trust}>
          <div className="lp-section__head" data-rise>
            <p className="orbit-kicker">{copy.trust.kicker}</p>
            <h2>{copy.trust.title}</h2>
            <p className="lp-section__lead">{copy.trust.subtitle}</p>
          </div>
          <div className="lp-trust__grid">
            {copy.trust.blocks.map((b) => (
              <article key={b.t} className="lp-trust__card">
                <h3>{b.t}</h3>
                <p>{b.d}</p>
              </article>
            ))}
          </div>
          <LearnMorePanel />
        </section>
      </main>

      <Footer />
    </div>
  )
}
