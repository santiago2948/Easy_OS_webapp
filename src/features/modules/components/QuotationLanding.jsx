import { useQuotationCopy } from '../content/quotationCopy'

function ServiceIcon({ name }) {
  if (name === 'sea') {
    return (
      <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
        <path
          d="M3 14c2 1 4 1 6 0s4-1 6 0 4 1 6 0M3 18c2 1 4 1 6 0s4-1 6 0 4 1 6 0"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
        <path d="M12 4v6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    )
  }

  if (name === 'air') {
    return (
      <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
        <path
          d="M3 12l18-7-4 8 4 8-18-7 5-1-1-5z"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
      </svg>
    )
  }

  return (
    <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
      <path
        d="M3 13h11l2 4h3l-1-4h2l-1-5H5l-2 5zM7 18a1.5 1.5 0 100 3 1.5 1.5 0 000-3zm9 0a1.5 1.5 0 100 3 1.5 1.5 0 000-3z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export default function QuotationLanding({ onStartQuote }) {
  const { landing } = useQuotationCopy()

  return (
    <div className="quote-shell">
      <div className="quote-shell__intro">
        <p className="orbit-kicker">{landing.kicker}</p>
        <h1>
          {landing.titleLead}{' '}
          <span className="quote-shell__accent">{landing.titleAccent}</span>
        </h1>
        <p className="quote-shell__lead">{landing.lead}</p>

        <ul className="quote-shell__benefits">
          {landing.benefits.map((item) => (
            <li key={item}>
              <span className="quote-shell__check" aria-hidden="true" />
              {item}
            </li>
          ))}
        </ul>

        <button type="button" className="btn btn--primary quote-shell__cta" onClick={onStartQuote}>
          {landing.cta}
        </button>
      </div>

      <div className="quote-shell__services">
        {landing.services.map((service) => (
          <article key={service.id} className="quote-service-card">
            <div className="quote-service-card__icon">
              <ServiceIcon name={service.id} />
            </div>
            <div className="quote-service-card__body">
              <h3>{service.title}</h3>
              <p>{service.description}</p>
              <ul className="quote-service-card__tags">
                {service.tags.map((tag) => (
                  <li key={tag}>{tag}</li>
                ))}
              </ul>
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}
