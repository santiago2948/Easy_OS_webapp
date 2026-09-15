import { useState } from 'react'
import { MODE_MEDIA, useLandingCopy } from '../content/landingNarrative'

export function TrustCoverage() {
  const { trust } = useLandingCopy()
  const modes = trust.coverage.modes
  const [active, setActive] = useState(0)

  return (
    <div className="lp-trust-coverage" data-rise>
      <h3>{trust.coverage.t}</h3>

      <div className="lp-trust-coverage__layout">
        <div className="lp-trust-coverage__stage">
          {modes.map((m, i) => {
            const v = MODE_MEDIA[m.key]
            if (!v) return null
            return (
              <div
                key={m.key}
                className={`lp-trust-coverage__panel${i === active ? ' is-active' : ''}`}
                aria-hidden={i !== active}
              >
                {v.video ? (
                  <video
                    className="lp-trust-coverage__bg"
                    autoPlay
                    muted
                    loop
                    playsInline
                    preload="metadata"
                    poster={v.media}
                  >
                    <source src={v.video} type="video/mp4" />
                  </video>
                ) : (
                  <div
                    className="lp-trust-coverage__bg lp-trust-coverage__bg--img"
                    style={{ backgroundImage: `url(${v.media})` }}
                  />
                )}
                <div className="lp-trust-coverage__veil" />
              </div>
            )
          })}
        </div>

        <div className="lp-trust-coverage__modes">
          {modes.map((m, i) => (
            <button
              key={m.key}
              type="button"
              className={`lp-trust-coverage__mode${i === active ? ' is-active' : ''}`}
              onMouseEnter={() => setActive(i)}
              onFocus={() => setActive(i)}
              onClick={() => setActive(i)}
              aria-pressed={i === active}
            >
              <span className="lp-trust-coverage__mode-tag">{m.mode}</span>
              <span className="lp-trust-coverage__mode-desc">{m.d}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
