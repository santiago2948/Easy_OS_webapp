import { CUSTOMER_LOGOS } from '../content/customerLogos'
import { SECTION_IDS, useLandingCopy } from '../content/landingNarrative'

export default function SuccessStoriesMarquee() {
  const { stories } = useLandingCopy()
  const logos = [...CUSTOMER_LOGOS, ...CUSTOMER_LOGOS]

  return (
    <section
      className="lp-section lp-success-stories"
      id={SECTION_IDS.stories}
      aria-labelledby="success-stories-title"
    >
      <div className="lp-section__head lp-success-stories__head" data-rise>
        <p className="orbit-kicker">{stories.kicker}</p>
        <h2 id="success-stories-title">{stories.title}</h2>
        <p className="lp-section__lead">{stories.subtitle}</p>
      </div>

      <div className="lp-success-stories__viewport" data-rise>
        <div className="lp-success-stories__track" aria-hidden="true">
          {logos.map((logo, index) => (
            <article
              key={`${logo.name}-${index}`}
              className="lp-logo-card"
              title={logo.name}
              data-tone={logo.tone}
              /* la segunda vuelta solo alimenta el bucle del carrusel */
              data-clone={index >= CUSTOMER_LOGOS.length ? 'true' : undefined}
            >
              <span className="lp-logo-card__puck" aria-hidden="true" />
              <span className="lp-logo-card__media">
                <img src={logo.src} alt="" loading="lazy" decoding="async" draggable={false} />
              </span>
            </article>
          ))}
        </div>

        <ul className="lp-success-stories__sr-list visually-hidden">
          {CUSTOMER_LOGOS.map((logo) => (
            <li key={logo.name}>{logo.name}</li>
          ))}
        </ul>
      </div>
    </section>
  )
}
