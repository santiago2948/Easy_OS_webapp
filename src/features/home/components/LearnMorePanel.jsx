import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { QUOTE_PATH } from '../content/landingNarrative'

const DIAL_CODES = [
  { value: '+57', label: '+57' },
  { value: '+1', label: '+1' },
  { value: '+52', label: '+52' },
  { value: '+51', label: '+51' },
  { value: '+56', label: '+56' },
  { value: '+54', label: '+54' },
  { value: '+593', label: '+593' },
  { value: '+58', label: '+58' },
]

export default function LearnMorePanel() {
  const [step, setStep] = useState(1)
  const [submitted, setSubmitted] = useState(false)
  const [contact, setContact] = useState({ countryCode: '+57', phone: '' })
  const nameInputRef = useRef(null)

  const handlePhoneStep = (event) => {
    event.preventDefault()
    const form = event.currentTarget
    const countryCode = form.countryCode.value
    const phone = form.phone.value.trim()

    if (!phone) return

    setContact({ countryCode, phone })
    setStep(2)
    requestAnimationFrame(() => nameInputRef.current?.focus())
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    const name = event.currentTarget.name.value.trim()
    if (!name) return

    console.info('[lead]', {
      name,
      countryCode: contact.countryCode,
      phone: contact.phone,
      fullPhone: `${contact.countryCode}${contact.phone.replace(/\s/g, '')}`,
    })

    setSubmitted(true)
    setStep(1)
    setContact({ countryCode: '+57', phone: '' })
    event.currentTarget.reset()
  }

  return (
    <div className="lp-trust-cta" id="contacto" data-rise>
      <p className="lp-trust-cta__label">Hablemos de tu operación</p>

      {submitted ? (
        <p className="lp-trust-cta__success" role="status">
          Gracias. Te contactaremos pronto.
        </p>
      ) : (
        <div className="lp-trust-cta__bar">
          {step === 1 ? (
            <form className="lp-trust-cta__form" onSubmit={handlePhoneStep} noValidate>
              <div className="lp-trust-cta__phone-row">
                <label className="visually-hidden" htmlFor="trust-dial">
                  Código de país
                </label>
                <select
                  id="trust-dial"
                  name="countryCode"
                  className="lp-trust-cta__dial"
                  defaultValue="+57"
                >
                  {DIAL_CODES.map((item) => (
                    <option key={item.value} value={item.value}>
                      {item.label}
                    </option>
                  ))}
                </select>
                <label className="visually-hidden" htmlFor="trust-phone">
                  Teléfono
                </label>
                <input
                  id="trust-phone"
                  type="tel"
                  name="phone"
                  className="lp-trust-cta__input"
                  autoComplete="tel-national"
                  placeholder="320 123 4567"
                  required
                />
              </div>
              <button type="submit" className="btn btn--ghost btn--ghost-light lp-trust-cta__send">
                Siguiente
              </button>
            </form>
          ) : (
            <form className="lp-trust-cta__form" onSubmit={handleSubmit} noValidate>
              <label className="visually-hidden" htmlFor="trust-name">
                Nombre
              </label>
              <input
                ref={nameInputRef}
                id="trust-name"
                type="text"
                name="name"
                className="lp-trust-cta__input"
                autoComplete="name"
                placeholder="Tu nombre"
                required
              />
              <button type="submit" className="btn btn--ghost btn--ghost-light lp-trust-cta__send">
                Enviar
              </button>
            </form>
          )}

          <span className="lp-trust-cta__divider" aria-hidden="true" />
          <Link to={QUOTE_PATH} className="btn btn--primary lp-trust-cta__quote">
            Cotizar
          </Link>
        </div>
      )}
    </div>
  )
}
