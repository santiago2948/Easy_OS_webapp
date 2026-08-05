import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'
import LearnMorePanel from '../components/LearnMorePanel'
import SuccessStoriesMarquee from '../components/SuccessStoriesMarquee'
import BrandLogo from '../components/BrandLogo'
import {
  CONTACT,
  FLOW,
  GEO,
  HERO,
  METHOD,
  QUOTE_PATH,
  TRUST,
} from '../content/landingNarrative'
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
  const rootRef = useRef(null)
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
    const section = document.getElementById(METHOD.id)
    if (!section || typeof IntersectionObserver === 'undefined') return undefined

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        METHOD.slides.forEach((slide) => {
          const href = slide.img
          if (document.querySelector(`link[rel="preload"][href="${href}"]`)) return
          const link = document.createElement('link')
          link.rel = 'preload'
          link.as = 'image'
          link.href = href
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
    const schema = {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'Organization',
          name: 'Easy Logistics',
          url: 'https://easy-logistics.co',
          email: 's.moreno@easy-logistics.co',
          telephone: '+57-320-897-6999',
          address: {
            '@type': 'PostalAddress',
            streetAddress: 'Avenida calle 26 # 69 - 76 TORRE 3 OF 1501',
            addressCountry: 'CO',
          },
          description: GEO.what,
        },
        {
          '@type': 'ProfessionalService',
          name: 'Easy Logistics. Forwarder B2B',
          serviceType: 'International freight brokerage',
          areaServed: 'Colombia',
          description: GEO.differentiator,
          provider: { '@type': 'Organization', name: 'Easy Logistics' },
        },
      ],
    }
    const el = document.createElement('script')
    el.type = 'application/ld+json'
    el.id = 'easy-landing-schema'
    el.textContent = JSON.stringify(schema)
    document.head.appendChild(el)
    return () => el.remove()
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
        <section className="orbit-hero" id="inicio">
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
            <p className="orbit-kicker">{HERO.kicker}</p>
            <BrandLogo variant="onDark" size="lg" showSubtitle={false} />
            <h1>
              {HERO.title}
              <span>{HERO.titleAccent}</span>
            </h1>
            <p className="orbit-lead">{HERO.lead}</p>
            <div className="orbit-actions">
              <Link to={QUOTE_PATH} className="btn btn--primary">
                {HERO.ctaQuote}
              </Link>
              <a
                href={CONTACT.whatsapp}
                className="btn btn--ghost btn--ghost-light"
                target="_blank"
                rel="noreferrer"
              >
                {HERO.ctaSecondary}
              </a>
            </div>
          </div>

          <p className="orbit-hero__hint" aria-hidden="true">
            {HERO.hint}
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
            id={FLOW.id}
            kicker={FLOW.kicker}
            title={FLOW.title}
            subtitle={FLOW.subtitle}
            steps={FLOW.steps}
            cta={{ label: FLOW.ctaSoft }}
            contact={FLOW.contact}
          />
        </Suspense>

        <Suspense fallback={null}>
          <RouteMesh />
        </Suspense>

        {/* 2 · Método Easy */}
        <section className="lp-section lp-method" id={METHOD.id}>
          <div className="lp-method__intro" data-rise>
            <p className="orbit-kicker">{METHOD.kicker}</p>
            <p className="lp-method__empathy">{METHOD.empathy}</p>
            <p className="lp-method__lead">{METHOD.intro}</p>
          </div>
          <div data-rise>
            <Suspense fallback={null}>
              <MethodReel />
            </Suspense>
          </div>
        </section>

        <SuccessStoriesMarquee />

        {/* 4 · Confianza */}
        <section className="lp-section lp-trust" id={TRUST.id}>
          <div className="lp-section__head" data-rise>
            <p className="orbit-kicker">{TRUST.kicker}</p>
            <h2>{TRUST.title}</h2>
            <p className="lp-section__lead">{TRUST.subtitle}</p>
          </div>
          <div className="lp-trust__grid">
            {TRUST.blocks.map((b) => (
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
