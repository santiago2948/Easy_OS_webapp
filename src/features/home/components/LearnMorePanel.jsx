import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { Turnstile } from '@marsidev/react-turnstile'
import DataConsentField from '../../legal/components/DataConsentField'
import {
  DATA_POLICY_VERSION,
  LEAD_PRIVACY_NOTICE,
} from '../../legal/content/dataConsent'
import { createLead } from '../api/createLead'
import { QUOTE_PATH, CONTACT_CTA } from '../content/landingNarrative'

const TURNSTILE_SITE_KEY = import.meta.env.VITE_TURNSTILE_SITE_KEY

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
  const [submitting, setSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [captchaToken, setCaptchaToken] = useState('')
  const [acceptedDataPolicy, setAcceptedDataPolicy] = useState(false)
  const [contact, setContact] = useState({ countryCode: '+57', phone: '' })
  const nameInputRef = useRef(null)
  const turnstileRef = useRef(null)

  const clearCaptcha = () => {
    setCaptchaToken('')
  }

  const resetCaptcha = () => {
    clearCaptcha()
    turnstileRef.current?.reset()
  }

  const handlePhoneStep = (event) => {
    event.preventDefault()
    const form = event.currentTarget
    const countryCode = form.countryCode.value
    const phone = form.phone.value.trim()

    if (!phone) return

    setErrorMessage('')
    setContact({ countryCode, phone })
    setStep(2)
    requestAnimationFrame(() => nameInputRef.current?.focus())
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    const form = event.currentTarget
    const name = form.name.value.trim()

    if (!name || !captchaToken || !acceptedDataPolicy || submitting) return

    setSubmitting(true)
    setErrorMessage('')

    const phoneNumber = `${contact.countryCode}${contact.phone.replace(/\s/g, '')}`

    try {
      await createLead({
        name,
        phoneNumber,
        captchaToken,
        acceptedDataPolicy: true,
        dataPolicyVersion: DATA_POLICY_VERSION,
      })
      setSubmitted(true)
      setStep(1)
      setContact({ countryCode: '+57', phone: '' })
      setAcceptedDataPolicy(false)
      clearCaptcha()
      form.reset()
    } catch (error) {
      setErrorMessage(error.message || 'No se pudo enviar el formulario')
      resetCaptcha()
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="lp-trust-cta" id="contacto" data-rise>
      <div className="lp-trust-cta__head">
        <p className="lp-trust-cta__label">{CONTACT_CTA.title}</p>
        <p className="lp-trust-cta__lead">{CONTACT_CTA.lead}</p>
        <ul className="lp-trust-cta__points">
          {CONTACT_CTA.points.map((point) => (
            <li key={point}>{point}</li>
          ))}
        </ul>
      </div>

      {submitted ? (
        <p className="lp-trust-cta__success" role="status">
          Gracias. Te contactaremos pronto.
        </p>
      ) : (
        <div className="lp-trust-cta__panel">
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
                  disabled={submitting}
                />
                <button
                  type="submit"
                  className="btn btn--ghost btn--ghost-light lp-trust-cta__send"
                  disabled={
                    !captchaToken ||
                    !acceptedDataPolicy ||
                    submitting ||
                    !TURNSTILE_SITE_KEY
                  }
                >
                  {submitting ? 'Enviando…' : 'Enviar'}
                </button>
              </form>
            )}

            <span className="lp-trust-cta__divider" aria-hidden="true" />
            <Link to={QUOTE_PATH} className="btn btn--primary lp-trust-cta__quote">
              Cotizar
            </Link>
          </div>

          {step === 2 ? (
            <div className="lp-trust-cta__verify">
              <DataConsentField
                id="trust-data-consent"
                checked={acceptedDataPolicy}
                onChange={setAcceptedDataPolicy}
                disabled={submitting}
                notice={LEAD_PRIVACY_NOTICE}
              />

              {TURNSTILE_SITE_KEY ? (
                <div className="lp-trust-cta__captcha">
                  <Turnstile
                    ref={turnstileRef}
                    siteKey={TURNSTILE_SITE_KEY}
                    options={{
                      theme: 'dark',
                      size: 'normal',
                    }}
                    onSuccess={setCaptchaToken}
                    onExpire={clearCaptcha}
                    onError={clearCaptcha}
                  />
                </div>
              ) : (
                <p className="lp-trust-cta__error" role="alert">
                  Falta configurar VITE_TURNSTILE_SITE_KEY.
                </p>
              )}

              {errorMessage ? (
                <p className="lp-trust-cta__error" role="alert">
                  {errorMessage}
                </p>
              ) : null}
            </div>
          ) : null}
        </div>
      )}
    </div>
  )
}
