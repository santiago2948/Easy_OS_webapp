import { lazy, Suspense } from 'react'

const ServicesMap = lazy(() =>
  import('./ServicesMap').then((m) => ({ default: m.ServicesMap })),
)

/**
 * Banda cinematográfica con video y mapa de servicios.
 */
export function VideoBand({ line, subline }) {
  return (
    <section className="lp-video-band" aria-label="Operación logística y servicios">
      <div className="lp-video-band__stage">
        <video
          className="lp-video-band__video"
          autoPlay
          muted
          loop
          playsInline
          preload="none"
          poster="/media/mode-sea.jpg"
        >
          <source src="/media/ship-orbit.mp4" type="video/mp4" />
        </video>
        <div className="lp-video-band__veil" />
        <div className="lp-video-band__grid" aria-hidden="true" />
        <div className="lp-video-band__copy" data-rise>
          {line && <p className="lp-video-band__line">{line}</p>}
          {subline && <p className="lp-video-band__sub">{subline}</p>}
        </div>
      </div>

      <Suspense fallback={null}>
        <ServicesMap />
      </Suspense>
    </section>
  )
}
