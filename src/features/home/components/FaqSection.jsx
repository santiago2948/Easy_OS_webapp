import { SECTION_IDS, useLandingCopy } from '../content/landingNarrative'

/**
 * Preguntas frecuentes en <details>/<summary> nativo: sin JavaScript,
 * accesible por teclado y con el texto de las respuestas presente en el
 * HTML aunque estén plegadas, que es lo que leen los rastreadores.
 */
export default function FaqSection() {
  const { faq } = useLandingCopy()

  return (
    <section
      className="lp-section lp-faq"
      id={SECTION_IDS.faq}
      aria-labelledby="faq-title"
    >
      <div className="lp-section__head lp-faq__head" data-rise>
        <p className="orbit-kicker">{faq.kicker}</p>
        <h2 id="faq-title">{faq.title}</h2>
        <p className="lp-section__lead">{faq.subtitle}</p>
      </div>

      <div className="lp-faq__list" data-rise>
        {faq.items.map((item) => (
          <details key={item.q} className="lp-faq__item">
            <summary className="lp-faq__question">
              <span>{item.q}</span>
              <span className="lp-faq__marker" aria-hidden="true">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none">
                  <path
                    d="M12 5v14M5 12h14"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
            </summary>
            <div className="lp-faq__answer">
              <p>{item.a}</p>
            </div>
          </details>
        ))}
      </div>
    </section>
  )
}
