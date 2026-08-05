import { CUSTOMER_LOGOS, SUCCESS_STORIES } from '../content/customerLogos'

export default function SuccessStoriesMarquee() {
  const logos = [...CUSTOMER_LOGOS, ...CUSTOMER_LOGOS]

  return (
    <section
      className="lp-section lp-success-stories"
      id="casos"
      aria-labelledby="success-stories-title"
    >
      <div className="lp-section__head lp-success-stories__head" data-rise>
        <p className="orbit-kicker">{SUCCESS_STORIES.kicker}</p>
        <h2 id="success-stories-title">{SUCCESS_STORIES.title}</h2>
        <p className="lp-section__lead">{SUCCESS_STORIES.subtitle}</p>
      </div>

      <div className="lp-success-stories__viewport" data-rise>
        <div className="lp-success-stories__fade lp-success-stories__fade--left" aria-hidden="true" />
        <div className="lp-success-stories__fade lp-success-stories__fade--right" aria-hidden="true" />

        <div className="lp-success-stories__track" aria-hidden="true">
          {logos.map((logo, index) => (
            <div
              key={`${logo.name}-${index}`}
              className="lp-success-stories__logo"
              title={logo.name}
            >
              <img src={logo.src} alt="" loading="lazy" decoding="async" draggable={false} />
            </div>
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
