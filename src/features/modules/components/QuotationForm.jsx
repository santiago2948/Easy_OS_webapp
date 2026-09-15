import { useEffect, useRef, useState } from 'react'
import { Turnstile } from '@marsidev/react-turnstile'
import DataConsentField from '../../legal/components/DataConsentField'
import { DATA_POLICY_VERSION } from '../../legal/content/dataConsent'
import { createQuote } from '../api/createQuote'
import { fetchQuoteRoutes } from '../api/fetchQuoteRoutes'
import { findCountry, findPort } from '../content/quotationRoutes'
import { useQuotationCopy } from '../content/quotationCopy'
import '../styles/quotation-form.css'

const TURNSTILE_SITE_KEY = import.meta.env.VITE_TURNSTILE_SITE_KEY

const SUMMARY_LOAD_MS = 1400

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

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const TOTAL_STEPS = 5

function GearIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
      <circle cx="12" cy="12" r="3" fill="none" stroke="currentColor" strokeWidth="1.8" />
      <path
        d="M12 2v2M12 20v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M2 12h2M20 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  )
}

function TruckIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
      <path
        d="M3 13h11l2 4h3l-1-4h2l-1-5H5l-2 5zM7 18a1.5 1.5 0 100 3 1.5 1.5 0 000-3zm9 0a1.5 1.5 0 100 3 1.5 1.5 0 000-3z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function PinIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
      <path
        d="M12 21s7-5.4 7-11a7 7 0 10-14 0c0 5.6 7 11 7 11z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="10" r="2.4" fill="none" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  )
}

function CubeIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
      <path
        d="M12 3l8 4.5v9L12 21l-8-4.5v-9L12 3zM12 12l8-4.5M12 12v9M12 12L4 7.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function InfoIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
      <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="1.8" />
      <path
        d="M12 11v6M12 7.5h.01"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  )
}

function PencilIcon() {
  return (
    <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true">
      <path
        d="M4 20h4L19 9l-4-4L4 16v4zM13 6l4 4"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function RouteArrowIcon({ direction }) {
  const isUp = direction === 'up'
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
      <path
        d={isUp ? 'M12 19V6M7 10l5-5 5 5' : 'M12 5v13M7 14l5 5 5-5'}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function OperationIcon({ name }) {
  if (name === 'import') {
    return (
      <svg viewBox="0 0 24 24" width="28" height="28" aria-hidden="true">
        <path
          d="M4 14h16v4H4zM12 4v10M9 11l3 3 3-3"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    )
  }

  return (
    <svg viewBox="0 0 24 24" width="28" height="28" aria-hidden="true">
      <path
        d="M4 10h16v4H4zM12 20V10M9 13l3-3 3 3"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function TransportModeIcon({ name }) {
  if (name === 'fcl') {
    return (
      <svg viewBox="0 0 24 24" width="28" height="28" aria-hidden="true">
        <path
          d="M6 8h12v10H6zM9 8V6h6v2"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinejoin="round"
        />
        <path d="M6 12h12" stroke="currentColor" strokeWidth="1.8" />
      </svg>
    )
  }

  if (name === 'lcl') {
    return (
      <svg viewBox="0 0 24 24" width="28" height="28" aria-hidden="true">
        <path
          d="M7 14h4v4H7zM13 11h4v7h-4zM7 8h4v3H7z"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
      </svg>
    )
  }

  return (
    <svg viewBox="0 0 24 24" width="28" height="28" aria-hidden="true">
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

function SelectionCard({ option, isSelected, onSelect, icon: Icon }) {
  return (
    <button
      type="button"
      className={`quote-form__card${isSelected ? ' is-selected' : ''}`}
      aria-pressed={isSelected}
      onClick={() => onSelect(option.id)}
    >
      <div className="quote-form__card-icon">
        <Icon name={option.id} />
      </div>
      <h3>{option.title}</h3>
      <p>{option.description}</p>
      <ul className="quote-form__card-tags">
        {option.tags.map((tag) => (
          <li key={tag}>{tag}</li>
        ))}
      </ul>
    </button>
  )
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
      <path
        d="M6 12l3.5 3.5L18 7"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function ArrowLeftIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
      <path
        d="M15 6l-6 6 6 6"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function ArrowRightIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
      <path
        d="M9 6l6 6-6 6"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function ChevronDownIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
      <path
        d="M6 9l6 6 6-6"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function SelectionSummary({ operation, transport }) {
  const { form } = useQuotationCopy()

  return (
    <section className="quote-form__summary" aria-live="polite">
      <div className="quote-form__summary-head">
        <span className="quote-form__summary-icon">
          <CheckIcon />
        </span>
        <h2>{form.summary.selection}</h2>
      </div>

      <div className="quote-form__summary-grid">
        {operation && (
          <div className="quote-form__summary-item">
            <span className="quote-form__summary-label">{form.summary.operationType}</span>
            <span className="quote-form__summary-badge">{operation.summaryLabel}</span>
          </div>
        )}
        {transport && (
          <div className="quote-form__summary-item">
            <span className="quote-form__summary-label">{form.summary.transportMode}</span>
            <span className="quote-form__summary-badge">{transport.summaryLabel}</span>
          </div>
        )}
      </div>
    </section>
  )
}

function RouteSummary({ originLabel, destinationLabel }) {
  const { form } = useQuotationCopy()

  return (
    <section className="quote-form__summary" aria-live="polite">
      <div className="quote-form__summary-head">
        <span className="quote-form__summary-icon">
          <CheckIcon />
        </span>
        <h2>{form.summary.route}</h2>
      </div>

      <div className="quote-form__summary-grid">
        <div className="quote-form__summary-item">
          <span className="quote-form__summary-label">{form.summary.origin}</span>
          <span className="quote-form__summary-badge quote-form__summary-badge--route">
            {originLabel}
          </span>
        </div>
        <div className="quote-form__summary-item">
          <span className="quote-form__summary-label">{form.summary.destination}</span>
          <span className="quote-form__summary-badge quote-form__summary-badge--route">
            {destinationLabel}
          </span>
        </div>
      </div>
    </section>
  )
}

function FieldSelect({ id, label, value, onChange, options, placeholder, disabled = false }) {
  return (
    <label className="quote-form__field" htmlFor={id}>
      <span className="quote-form__field-label">{label}</span>
      <span className="quote-form__select-wrap">
        <select
          id={id}
          className="quote-form__select"
          value={value}
          onChange={onChange}
          disabled={disabled}
        >
          <option value="">{placeholder}</option>
          {options.map((option) => (
            <option key={option.id} value={option.id}>
              {option.name}
            </option>
          ))}
        </select>
        <span className="quote-form__select-caret" aria-hidden="true">
          <ChevronDownIcon />
        </span>
      </span>
    </label>
  )
}

function FieldInput({
  id,
  label,
  value,
  onChange,
  type = 'text',
  inputMode,
  min,
  step: inputStep,
  placeholder,
  disabled = false,
}) {
  return (
    <label className="quote-form__field" htmlFor={id}>
      <span className="quote-form__field-label">{label}</span>
      <input
        id={id}
        className="quote-form__input"
        type={type}
        inputMode={inputMode}
        min={min}
        step={inputStep}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        disabled={disabled}
      />
    </label>
  )
}

function isPositiveNumber(value) {
  const parsed = Number(value)
  return value !== '' && Number.isFinite(parsed) && parsed > 0
}

function formatMetric(value, digits = 2) {
  return value.toFixed(digits)
}

const AIR_VOLUMETRIC_KG_PER_M3 = 167

/** Ocean LCL: W/M in tons. Air: chargeable weight in kg (IATA ≈ m³ × 167). FCL: per container. */
function computeCargoMetrics(cargo, transportMode) {
  if (transportMode === 'fcl') {
    const quantity = Number(cargo.quantity)
    const containerType = cargo.containerType

    const hasQuantity = Number.isFinite(quantity) && quantity >= 1
    const hasContainerType = Boolean(containerType)

    if (!hasQuantity || !hasContainerType) return null

    return {
      mode: 'fcl',
      quantity,
      containerType,
      isComplete: true,
    }
  }

  const quantity = Number(cargo.quantity)
  const length = Number(cargo.length)
  const width = Number(cargo.width)
  const height = Number(cargo.height)
  const weightKg = Number(cargo.weight)

  const hasDimensions =
    Number.isFinite(quantity) &&
    quantity >= 1 &&
    [length, width, height].every((value) => Number.isFinite(value) && value > 0)

  if (!hasDimensions) return null

  const volumeM3 = length * width * height * quantity
  const hasWeight = Number.isFinite(weightKg) && weightKg > 0
  const actualWeightKg = hasWeight ? weightKg * quantity : null

  if (transportMode === 'air') {
    const volumetricKg = volumeM3 * AIR_VOLUMETRIC_KG_PER_M3
    const chargeableKg =
      actualWeightKg == null ? volumetricKg : Math.max(actualWeightKg, volumetricKg)

    return {
      mode: 'air',
      quantity,
      length,
      width,
      height,
      weightKg: hasWeight ? weightKg : null,
      actualWeightKg,
      volumeM3,
      volumetricKg,
      chargeableKg,
      isComplete: hasWeight,
    }
  }

  const volumetricTons = volumeM3
  const actualTons = actualWeightKg == null ? null : actualWeightKg / 1000
  const chargeableTons = actualTons == null ? volumetricTons : Math.max(actualTons, volumetricTons)

  return {
    mode: 'lcl',
    quantity,
    length,
    width,
    height,
    weightKg: hasWeight ? weightKg : null,
    volumeM3,
    volumetricTons,
    chargeableTons,
    isComplete: hasWeight,
  }
}

function CargoMetricsPanel({ metrics }) {
  const { form } = useQuotationCopy()
  const isAir = metrics.mode === 'air'

  if (isAir) {
    return (
      <aside className="quote-form__cargo-metrics" aria-live="polite">
        <div className="quote-form__cargo-metric">
          <strong>{form.metrics.volume}</strong>
          <span>{formatMetric(metrics.volumeM3)} m³</span>
        </div>
        <div className="quote-form__cargo-metric">
          <strong>{form.metrics.grossWeight}</strong>
          <span>
            {metrics.actualWeightKg == null
              ? '—'
              : `${formatMetric(metrics.actualWeightKg)} kg`}
          </span>
        </div>
        <div className="quote-form__cargo-metric">
          <strong>{form.metrics.chargeableAir}</strong>
          <span>{formatMetric(metrics.chargeableKg)} kg</span>
          <small>{form.metrics.hintAir}</small>
        </div>
      </aside>
    )
  }

  return (
    <aside className="quote-form__cargo-metrics" aria-live="polite">
      <div className="quote-form__cargo-metric">
        <strong>{form.metrics.volume}</strong>
        <span>{formatMetric(metrics.volumeM3)} m³</span>
      </div>
      <div className="quote-form__cargo-metric">
        <strong>{form.metrics.volumetricWeight}</strong>
        <span>{formatMetric(metrics.volumetricTons)} TON</span>
      </div>
      <div className="quote-form__cargo-metric">
        <strong>{form.metrics.chargeableSea}</strong>
        <span>{formatMetric(metrics.chargeableTons)} TON</span>
        <small>{form.metrics.hintSea}</small>
      </div>
    </aside>
  )
}

function FclCargoSummary({ metrics, declaredValueUsd }) {
  const { form } = useQuotationCopy()

  return (
    <section className="quote-form__summary" aria-live="polite">
      <div className="quote-form__summary-head">
        <span className="quote-form__summary-icon">
          <CheckIcon />
        </span>
        <h2>{form.summary.cargo}</h2>
      </div>

      <div className="quote-form__summary-grid quote-form__summary-grid--cargo">
        <div className="quote-form__summary-item">
          <span className="quote-form__summary-label">{form.summary.containerType}</span>
          <span className="quote-form__summary-badge quote-form__summary-badge--route">
            {metrics.containerType}
          </span>
        </div>
        <div className="quote-form__summary-item">
          <span className="quote-form__summary-label">{form.summary.quantity}</span>
          <span className="quote-form__summary-badge">{metrics.quantity}</span>
        </div>
        <div className="quote-form__summary-item">
          <span className="quote-form__summary-label">{form.summary.declaredValue}</span>
          <span className="quote-form__summary-badge quote-form__summary-badge--soft">
            USD {Number(declaredValueUsd).toLocaleString('en-US')}
          </span>
        </div>
      </div>
    </section>
  )
}

function CargoSummary({ metrics, declaredValueUsd }) {
  const { form } = useQuotationCopy()
  const dimensionsLabel = `${metrics.length} x ${metrics.width} x ${metrics.height} m`
  const isAir = metrics.mode === 'air'

  return (
    <section className="quote-form__summary" aria-live="polite">
      <div className="quote-form__summary-head">
        <span className="quote-form__summary-icon">
          <CheckIcon />
        </span>
        <h2>{form.summary.cargo}</h2>
      </div>

      <div className="quote-form__summary-grid quote-form__summary-grid--cargo">
        <div className="quote-form__summary-col">
          <div className="quote-form__summary-item">
            <span className="quote-form__summary-label">{form.summary.quantity}</span>
            <span className="quote-form__summary-badge">{metrics.quantity}</span>
          </div>
          <div className="quote-form__summary-item">
            <span className="quote-form__summary-label">{form.summary.dimensions}</span>
            <span className="quote-form__summary-badge quote-form__summary-badge--route">
              {dimensionsLabel}
            </span>
          </div>
          <div className="quote-form__summary-item">
            <span className="quote-form__summary-label">{form.summary.weight}</span>
            <span className="quote-form__summary-badge quote-form__summary-badge--soft">
              {metrics.weightKg} kg
            </span>
          </div>
          <div className="quote-form__summary-item">
            <span className="quote-form__summary-label">{form.summary.declaredValue}</span>
            <span className="quote-form__summary-badge quote-form__summary-badge--soft">
              USD {Number(declaredValueUsd).toLocaleString('en-US')}
            </span>
          </div>
        </div>

        <div className="quote-form__summary-col">
          <div className="quote-form__summary-item">
            <span className="quote-form__summary-label">{form.summary.volume}</span>
            <span className="quote-form__summary-badge quote-form__summary-badge--soft">
              {formatMetric(metrics.volumeM3)} m³
            </span>
          </div>
          <div className="quote-form__summary-item">
            <span className="quote-form__summary-label">
              {isAir ? form.summary.grossWeight : form.summary.volumetricWeight}
            </span>
            <span className="quote-form__summary-badge quote-form__summary-badge--soft">
              {isAir
                ? metrics.actualWeightKg == null
                  ? '—'
                  : `${formatMetric(metrics.actualWeightKg)} kg`
                : `${formatMetric(metrics.volumetricTons)} TON`}
            </span>
          </div>
          <div className="quote-form__summary-item quote-form__summary-item--stack">
            <div className="quote-form__summary-item-row">
              <span className="quote-form__summary-label">
                {isAir ? form.summary.chargeableWeightAir : form.summary.chargeableWeightSea}
              </span>
              <span className="quote-form__summary-badge quote-form__summary-badge--soft">
                {isAir
                  ? `${formatMetric(metrics.chargeableKg)} kg`
                  : `${formatMetric(metrics.chargeableTons)} TON`}
              </span>
            </div>
            <small className="quote-form__summary-hint">
              {isAir ? form.metrics.hintAir : form.metrics.hintSea}
            </small>
          </div>
        </div>
      </div>
    </section>
  )
}

function LockedCountryField({ name, hint }) {
  const { form } = useQuotationCopy()

  return (
    <div className="quote-form__field">
      <span className="quote-form__field-label">{form.fields.country}</span>
      <div className="quote-form__locked-country" aria-live="polite">
        <strong>{name}</strong>
        <span>{hint}</span>
      </div>
    </div>
  )
}

function formatQuoteDate(date, locale) {
  return new Intl.DateTimeFormat(locale, {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date)
}

function ReviewBadge({ children, tone = 'accent' }) {
  return (
    <span className={`quote-form__review-badge quote-form__review-badge--${tone}`}>
      {children}
    </span>
  )
}

function ReviewSection({ icon: Icon, title, onEdit, children }) {
  const { form } = useQuotationCopy()

  return (
    <section className="quote-form__review-card">
      <header className="quote-form__review-head">
        <div className="quote-form__review-title">
          <span className="quote-form__review-icon" aria-hidden="true">
            <Icon />
          </span>
          <h2>{title}</h2>
        </div>
        {onEdit && (
          <button type="button" className="quote-form__review-edit" onClick={onEdit}>
            <PencilIcon />
            {form.review.edit}
          </button>
        )}
      </header>
      <div className="quote-form__review-body">{children}</div>
    </section>
  )
}

function QuoteSummaryLoader() {
  const { form } = useQuotationCopy()

  return (
    <div className="quote-form__loader" role="status" aria-live="polite">
      <span className="quote-form__spinner" aria-hidden="true" />
      <p>{form.loading.summary}</p>
    </div>
  )
}

function QuoteSuccess({ email, quoteNumber, onFinish }) {
  const { form } = useQuotationCopy()

  return (
    <section className="quote-form__success" role="status" aria-live="polite">
      <span className="quote-form__success-icon" aria-hidden="true">
        <CheckIcon />
      </span>
      <h2>{form.success.title}</h2>
      <p>
        {form.success.leadStart} <strong>{email}</strong> {form.success.leadEnd}
        {quoteNumber ? (
          <>
            {' '}
            (<strong>{quoteNumber}</strong>)
          </>
        ) : null}
        .
      </p>
      <button type="button" className="quote-form__nav quote-form__nav--next" onClick={onFinish}>
        {form.success.finish}
      </button>
    </section>
  )
}

function ContactStepForm({
  contact,
  onChange,
  errorMessage,
  disabled,
  turnstileRef,
  onCaptchaSuccess,
  onCaptchaClear,
  acceptedDataPolicy,
  onAcceptedDataPolicyChange,
}) {
  const { form } = useQuotationCopy()

  return (
    <section className="quote-form__section" aria-labelledby="quote-form-contact-label">
      <h2 id="quote-form-contact-label" className="quote-form__section-label">
        <InfoIcon />
        {form.sections.contact}
      </h2>

      <div className="quote-form__contact">
        <FieldInput
          id="quote-contact-name"
          label={form.contact.name}
          type="text"
          placeholder={form.contact.namePlaceholder}
          value={contact.name}
          onChange={(event) => onChange('name', event.target.value)}
          disabled={disabled}
        />

        <FieldInput
          id="quote-contact-email"
          label={form.contact.email}
          type="email"
          inputMode="email"
          placeholder={form.contact.emailPlaceholder}
          value={contact.email}
          onChange={(event) => onChange('email', event.target.value)}
          disabled={disabled}
        />

        <div className="quote-form__field">
          <span className="quote-form__field-label" id="quote-contact-phone-label">
            {form.contact.phone}
          </span>
          <div className="quote-form__phone-row" role="group" aria-labelledby="quote-contact-phone-label">
            <label className="visually-hidden" htmlFor="quote-contact-dial">
              {form.contact.dialLabel}
            </label>
            <select
              id="quote-contact-dial"
              className="quote-form__dial"
              value={contact.countryCode}
              onChange={(event) => onChange('countryCode', event.target.value)}
              disabled={disabled}
            >
              {DIAL_CODES.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </select>
            <input
              id="quote-contact-phone"
              className="quote-form__input"
              type="tel"
              inputMode="tel"
              autoComplete="tel-national"
              placeholder={form.contact.phonePlaceholder}
              value={contact.phone}
              onChange={(event) => onChange('phone', event.target.value)}
              disabled={disabled}
            />
          </div>
        </div>

        <DataConsentField
          id="quote-data-consent"
          checked={acceptedDataPolicy}
          onChange={onAcceptedDataPolicyChange}
          disabled={disabled}
          notice={form.contact.privacyNotice}
          label={form.contact.consentLabel}
          policyLabel={form.contact.consentPolicy}
        />

        {TURNSTILE_SITE_KEY ? (
          <div className="quote-form__captcha">
            <Turnstile
              ref={turnstileRef}
              siteKey={TURNSTILE_SITE_KEY}
              options={{
                theme: 'dark',
                size: 'flexible',
              }}
              onSuccess={onCaptchaSuccess}
              onExpire={onCaptchaClear}
              onError={onCaptchaClear}
            />
          </div>
        ) : (
          <p className="quote-form__error" role="alert">
            {form.contact.captchaMissing}
          </p>
        )}

        {errorMessage ? (
          <p className="quote-form__error" role="alert">
            {errorMessage}
          </p>
        ) : null}

        <p className="quote-form__contact-note">
          {form.contact.note}
        </p>
      </div>
    </section>
  )
}

function getLocationPointLabel(transportMode, point) {
  return transportMode === 'air' ? point.air : point.sea
}

function QuoteReview({
  quoteMeta,
  operation,
  transport,
  originCountry,
  originPort,
  destinationCountry,
  destinationPort,
  cargoMetrics,
  declaredValueUsd,
  onEditStep,
}) {
  const { form, locale } = useQuotationCopy()
  const isFcl = cargoMetrics?.mode === 'fcl'
  const isAir = cargoMetrics?.mode === 'air'
  const locationPointLabel = getLocationPointLabel(transport?.id, form.point)

  return (
    <div className="quote-form__review">
      <ReviewSection icon={InfoIcon} title={form.review.quoteInfo}>
        <div className="quote-form__review-grid">
          <div className="quote-form__summary-item">
            <span className="quote-form__summary-label">{form.review.quoteNumber}</span>
            <ReviewBadge tone="soft">
              {quoteMeta.number ?? form.review.quoteNumberPending}
            </ReviewBadge>
          </div>
          <div className="quote-form__summary-item">
            <span className="quote-form__summary-label">{form.review.createdAt}</span>
            <span className="quote-form__review-text">
              {formatQuoteDate(quoteMeta.createdAt, locale)}
            </span>
          </div>
        </div>
      </ReviewSection>

      <ReviewSection
        icon={GearIcon}
        title={form.review.operationSetup}
        onEdit={() => onEditStep(1)}
      >
        <div className="quote-form__review-grid">
          <div className="quote-form__summary-item">
            <span className="quote-form__summary-label">{form.summary.operationType}</span>
            <ReviewBadge>{operation?.title?.toUpperCase()}</ReviewBadge>
          </div>
          <div className="quote-form__summary-item">
            <span className="quote-form__summary-label">{form.summary.transportMode}</span>
            <ReviewBadge>{transport?.summaryLabel}</ReviewBadge>
          </div>
        </div>
      </ReviewSection>

      <ReviewSection icon={PinIcon} title={form.review.route} onEdit={() => onEditStep(2)}>
        <div className="quote-form__review-route">
          <div className="quote-form__review-route-block">
            <h3>
              <RouteArrowIcon direction="up" />
              {form.review.origin}
            </h3>
            <p>
              <strong>{form.review.country}</strong> {originCountry?.name}
            </p>
            <p>
              <strong>{locationPointLabel}:</strong> {originPort?.name}
            </p>
          </div>
          <div className="quote-form__review-route-block">
            <h3>
              <RouteArrowIcon direction="down" />
              {form.review.destination}
            </h3>
            <p>
              <strong>{form.review.country}</strong> {destinationCountry?.name}
            </p>
            <p>
              <strong>{locationPointLabel}:</strong> {destinationPort?.name}
            </p>
          </div>
        </div>
      </ReviewSection>

      <ReviewSection icon={CubeIcon} title={form.review.cargoInfo} onEdit={() => onEditStep(3)}>
        {isFcl ? (
          <div className="quote-form__review-grid quote-form__review-grid--cargo">
            <div className="quote-form__summary-item">
              <span className="quote-form__summary-label">{form.summary.containerType}</span>
              <ReviewBadge tone="soft">{cargoMetrics.containerType}</ReviewBadge>
            </div>
            <div className="quote-form__summary-item">
              <span className="quote-form__summary-label">{form.review.containerQuantity}</span>
              <ReviewBadge>{cargoMetrics.quantity}</ReviewBadge>
            </div>
            <div className="quote-form__summary-item">
              <span className="quote-form__summary-label">{form.summary.declaredValue}</span>
              <ReviewBadge tone="soft">
                USD {Number(declaredValueUsd).toLocaleString('en-US')}
              </ReviewBadge>
            </div>
          </div>
        ) : (
          <>
            <div className="quote-form__review-grid quote-form__review-grid--cargo">
              <div className="quote-form__summary-item">
                <span className="quote-form__summary-label">{form.review.cargoQuantity}</span>
                <ReviewBadge>{cargoMetrics.quantity}</ReviewBadge>
              </div>
              <div className="quote-form__summary-item">
                <span className="quote-form__summary-label">{form.summary.dimensions}</span>
                <ReviewBadge tone="soft">
                  {cargoMetrics.length} x {cargoMetrics.width} x {cargoMetrics.height} m
                </ReviewBadge>
              </div>
              <div className="quote-form__summary-item">
                <span className="quote-form__summary-label">{form.summary.weight}</span>
                <ReviewBadge tone="soft">{cargoMetrics.weightKg} kg</ReviewBadge>
              </div>
              <div className="quote-form__summary-item">
                <span className="quote-form__summary-label">{form.summary.volume}</span>
                <ReviewBadge tone="soft">{formatMetric(cargoMetrics.volumeM3)} m³</ReviewBadge>
              </div>
              <div className="quote-form__summary-item">
                <span className="quote-form__summary-label">
                  {isAir ? form.summary.grossWeight : form.summary.volumetricWeight}
                </span>
                <ReviewBadge tone="soft">
                  {isAir
                    ? cargoMetrics.actualWeightKg == null
                      ? '—'
                      : `${formatMetric(cargoMetrics.actualWeightKg)} kg`
                    : `${formatMetric(cargoMetrics.volumetricTons)} TON`}
                </ReviewBadge>
              </div>
              <div className="quote-form__summary-item">
                <span className="quote-form__summary-label">
                  {isAir ? form.summary.chargeableWeightAir : form.summary.chargeableWeightSea}
                </span>
                <ReviewBadge tone="soft">
                  {isAir
                    ? `${formatMetric(cargoMetrics.chargeableKg)} kg`
                    : `${formatMetric(cargoMetrics.chargeableTons)} TON`}
                </ReviewBadge>
              </div>
              <div className="quote-form__summary-item">
                <span className="quote-form__summary-label">{form.summary.declaredValue}</span>
                <ReviewBadge tone="soft">
                  USD {Number(declaredValueUsd).toLocaleString('en-US')}
                </ReviewBadge>
              </div>
            </div>
            <p className="quote-form__review-note">
              <InfoIcon />
              {isAir ? form.metrics.noteAir : form.metrics.noteSea}
            </p>
          </>
        )}
      </ReviewSection>
    </div>
  )
}

export default function QuotationForm({ onBack }) {
  const { form } = useQuotationCopy()
  const [step, setStep] = useState(1)
  const [operationType, setOperationType] = useState(null)
  const [transportMode, setTransportMode] = useState(null)
  const [originCountryId, setOriginCountryId] = useState('')
  const [originPortId, setOriginPortId] = useState('')
  const [destinationCountryId, setDestinationCountryId] = useState('')
  const [destinationPortId, setDestinationPortId] = useState('')
  const [routeOptions, setRouteOptions] = useState(null)
  const [routesLoading, setRoutesLoading] = useState(false)
  const [routesError, setRoutesError] = useState(null)
  const [routesReloadKey, setRoutesReloadKey] = useState(0)
  const [cargo, setCargo] = useState({
    quantity: '1',
    containerType: '',
    length: '',
    width: '',
    height: '',
    weight: '',
    declaredValueUsd: '',
  })
  const [summaryLoading, setSummaryLoading] = useState(false)
  const [quoteMeta, setQuoteMeta] = useState(null)
  const [contact, setContact] = useState({
    name: '',
    email: '',
    countryCode: '+57',
    phone: '',
  })
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [quoteSubmitted, setQuoteSubmitted] = useState(false)
  const [captchaToken, setCaptchaToken] = useState('')
  const [acceptedDataPolicy, setAcceptedDataPolicy] = useState(false)
  const turnstileRef = useRef(null)
  const submittingRef = useRef(false)

  const selectedOperation = form.operations.find((item) => item.id === operationType)
  const selectedTransport = form.transports.find((item) => item.id === transportMode)
  const originCountries = routeOptions?.origin?.countries ?? []
  const destinationCountries = routeOptions?.destination?.countries ?? []
  const originLockedCountry = routeOptions?.origin?.lockedCountry ?? null
  const destinationLockedCountry = routeOptions?.destination?.lockedCountry ?? null
  const originCountry = findCountry(originCountries, originCountryId)
  const destinationCountry = findCountry(destinationCountries, destinationCountryId)
  const originPort = findPort(originCountries, originCountryId, originPortId)
  const destinationPort = findPort(destinationCountries, destinationCountryId, destinationPortId)
  const originPorts = originCountry?.ports ?? []
  const destinationPorts = destinationCountry?.ports ?? []

  const hasStep1Selections = Boolean(operationType || transportMode)
  const isStep1Complete = Boolean(operationType && transportMode)
  const isFcl = transportMode === 'fcl'
  const isAir = transportMode === 'air'
  const locationPointLabel = getLocationPointLabel(transportMode, form.point)
  const locationPointLabelLower = locationPointLabel.toLowerCase()
  const isFclContainerSelected = !isFcl || Boolean(cargo.containerType)
  const isStep2Complete =
    isFclContainerSelected &&
    Boolean(originCountry && originPort && destinationCountry && destinationPort)
  const cargoMetrics = computeCargoMetrics(cargo, transportMode)
  const declaredValueNumber = Number(cargo.declaredValueUsd)
  const hasDeclaredValue = Number.isFinite(declaredValueNumber) && declaredValueNumber > 0
  const isStep3Complete = Boolean(cargoMetrics?.isComplete && hasDeclaredValue)

  const originLabel =
    originCountry && originPort ? `${originCountry.name} - ${originPort.name}` : null
  const destinationLabel =
    destinationCountry && destinationPort
      ? `${destinationCountry.name} - ${destinationPort.name}`
      : null

  const progress = Math.round((step / TOTAL_STEPS) * 100)

  const steps = form.steps
  const stepCopyByStep = {
    1: steps.s1,
    2: {
      title: isFcl ? steps.s2.titleFcl : steps.s2.title,
      subtitle: isFcl
        ? steps.s2.subtitleFcl
        : isAir
          ? steps.s2.subtitleAir
          : steps.s2.subtitle,
    },
    3: {
      title: steps.s3.title,
      subtitle: isFcl ? steps.s3.subtitleFcl : steps.s3.subtitle,
    },
    4: {
      title: steps.s4.title,
      subtitle: summaryLoading ? steps.s4.subtitleLoading : steps.s4.subtitle,
    },
    5: {
      title: quoteSubmitted ? steps.s5.titleSent : steps.s5.title,
      subtitle: quoteSubmitted ? steps.s5.subtitleSent : steps.s5.subtitle,
    },
  }
  const stepCopy = stepCopyByStep[step] ?? {
    title: steps.fallbackTitle(step),
    subtitle: steps.fallbackSubtitle,
  }

  const cargoSectionTitle = selectedTransport
    ? `${form.sections.cargo} ${selectedTransport.title}`
    : form.sections.cargo

  const phoneDigits = contact.phone.replace(/\D/g, '')
  const isStep5Complete =
    contact.name.trim().length >= 2 &&
    EMAIL_RE.test(contact.email.trim()) &&
    phoneDigits.length >= 7 &&
    Boolean(captchaToken) &&
    acceptedDataPolicy &&
    Boolean(TURNSTILE_SITE_KEY)

  const canContinue =
    step === 1
      ? isStep1Complete
      : step === 2
        ? isStep2Complete && !routesLoading
        : step === 3
          ? isStep3Complete
          : step === 4
            ? !summaryLoading && Boolean(quoteMeta)
            : step === 5
              ? isStep5Complete && !submitting && !quoteSubmitted
              : false

  const clearCaptcha = () => {
    setCaptchaToken('')
  }

  const resetCaptcha = () => {
    clearCaptcha()
    turnstileRef.current?.reset()
  }

  const resetRouteSelections = () => {
    setOriginCountryId('')
    setOriginPortId('')
    setDestinationCountryId('')
    setDestinationPortId('')
    setRouteOptions(null)
    setRoutesError(null)
  }

  useEffect(() => {
    if (step !== 2 || !operationType || !transportMode) return undefined
    if (isFcl && !cargo.containerType) {
      setRouteOptions(null)
      setRoutesError(null)
      setRoutesLoading(false)
      return undefined
    }

    let cancelled = false
    setRoutesLoading(true)
    setRoutesError(null)

    fetchQuoteRoutes({
      operationType,
      transportMode,
      containerType: isFcl ? cargo.containerType : undefined,
    })
      .then((data) => {
        if (cancelled) return
        setRouteOptions(data)

        const nextOriginCountryId = data.origin?.lockedCountry?.id ?? ''
        const nextDestinationCountryId = data.destination?.lockedCountry?.id ?? ''
        setOriginCountryId(nextOriginCountryId)
        setOriginPortId('')
        setDestinationCountryId(nextDestinationCountryId)
        setDestinationPortId('')
      })
      .catch((error) => {
        if (cancelled) return
        setRouteOptions(null)
        setRoutesError(error.message || '')
      })
      .finally(() => {
        if (!cancelled) setRoutesLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [step, operationType, transportMode, routesReloadKey, isFcl, cargo.containerType])

  useEffect(() => {
    if (step !== 4) return undefined

    let cancelled = false
    setSummaryLoading(true)

    const timer = window.setTimeout(() => {
      if (cancelled) return
      setQuoteMeta((current) =>
        current ?? {
          createdAt: new Date(),
        },
      )
      setSummaryLoading(false)
    }, SUMMARY_LOAD_MS)

    return () => {
      cancelled = true
      window.clearTimeout(timer)
    }
  }, [step])

  const updateCargoField = (field) => (event) => {
    setCargo((current) => ({ ...current, [field]: event.target.value }))
  }

  const handleOriginCountryChange = (event) => {
    const nextCountryId = event.target.value
    setOriginCountryId(nextCountryId)
    setOriginPortId('')
  }

  const handleDestinationCountryChange = (event) => {
    const nextCountryId = event.target.value
    setDestinationCountryId(nextCountryId)
    setDestinationPortId('')
  }

  const handleOperationSelect = (nextOperationType) => {
    setOperationType(nextOperationType)
    resetRouteSelections()
    setCargo((current) => ({ ...current, containerType: '' }))
  }

  const handleContainerTypeChange = (event) => {
    const nextContainerType = event.target.value
    setCargo((current) => ({ ...current, containerType: nextContainerType }))
    setOriginCountryId('')
    setOriginPortId('')
    setDestinationCountryId('')
    setDestinationPortId('')
    setRouteOptions(null)
    setRoutesError(null)
  }

  const handleTransportSelect = (nextTransportMode) => {
    setTransportMode(nextTransportMode)
    resetRouteSelections()
    setCargo({
      quantity: '1',
      containerType: '',
      length: '',
      width: '',
      height: '',
      weight: '',
      declaredValueUsd: cargo.declaredValueUsd,
    })
  }

  const handleEditStep = (targetStep) => {
    setSummaryLoading(false)
    setStep(targetStep)
  }

  const handleContactChange = (field, value) => {
    setContact((current) => ({ ...current, [field]: value }))
    if (submitError) setSubmitError('')
  }

  const buildQuotePayload = () => ({
    name: contact.name.trim(),
    email: contact.email.trim(),
    phoneNumber: `${contact.countryCode}${contact.phone.replace(/\s/g, '')}`,
    captchaToken,
    acceptedDataPolicy: true,
    dataPolicyVersion: DATA_POLICY_VERSION,
    operationType,
    transportMode,
    origin: {
      countryId: originCountry?.id,
      countryName: originCountry?.name,
      portId: originPort?.id,
      portName: originPort?.name,
    },
    destination: {
      countryId: destinationCountry?.id,
      countryName: destinationCountry?.name,
      portId: destinationPort?.id,
      portName: destinationPort?.name,
    },
    cargo:
      transportMode === 'fcl'
        ? {
            quantity: cargoMetrics.quantity,
            containerType: cargoMetrics.containerType,
            declaredValueUsd: declaredValueNumber,
          }
        : transportMode === 'air'
          ? {
              quantity: cargoMetrics.quantity,
              length: cargoMetrics.length,
              width: cargoMetrics.width,
              height: cargoMetrics.height,
              weightKg: cargoMetrics.weightKg,
              volumeM3: cargoMetrics.volumeM3,
              volumetricKg: cargoMetrics.volumetricKg,
              chargeableKg: cargoMetrics.chargeableKg,
              declaredValueUsd: declaredValueNumber,
            }
          : {
              quantity: cargoMetrics.quantity,
              length: cargoMetrics.length,
              width: cargoMetrics.width,
              height: cargoMetrics.height,
              weightKg: cargoMetrics.weightKg,
              volumeM3: cargoMetrics.volumeM3,
              volumetricTons: cargoMetrics.volumetricTons,
              chargeableTons: cargoMetrics.chargeableTons,
              declaredValueUsd: declaredValueNumber,
            },
  })

  const handleSubmitQuote = async () => {
    if (
      submittingRef.current ||
      !canContinue ||
      !cargoMetrics ||
      !quoteMeta ||
      !captchaToken ||
      !acceptedDataPolicy
    ) {
      return
    }

    submittingRef.current = true
    setSubmitting(true)
    setSubmitError('')

    try {
      const response = await createQuote(buildQuotePayload())
      const officialQuoteNumber = response?.data?.quoteNumber
      if (officialQuoteNumber) {
        setQuoteMeta((current) => ({
          ...(current ?? { createdAt: new Date() }),
          number: officialQuoteNumber,
        }))
      }
      setQuoteSubmitted(true)
      setAcceptedDataPolicy(false)
      clearCaptcha()
    } catch (error) {
      setSubmitError(error.message || form.errors.submit)
      resetCaptcha()
    } finally {
      submittingRef.current = false
      setSubmitting(false)
    }
  }

  const handleBack = () => {
    if (quoteSubmitted) {
      onBack()
      return
    }
    if (step === 1) {
      onBack()
      return
    }
    setStep((current) => Math.max(current - 1, 1))
  }

  const handleContinue = () => {
    if (!canContinue) return
    if (step === 5) {
      handleSubmitQuote()
      return
    }
    setStep((current) => Math.min(current + 1, TOTAL_STEPS))
  }

  return (
    <article className="quote-form">
      <div className="quote-form__progress">
        <div className="quote-form__progress-meta">
          <span>{form.progress.stepOf(step, TOTAL_STEPS)}</span>
          <span>{form.progress.completed(progress)}</span>
        </div>
        <div
          className="quote-form__progress-bar"
          role="progressbar"
          aria-valuenow={progress}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={form.progress.aria(progress)}
        >
          <span style={{ width: `${progress}%` }} />
        </div>
      </div>

      <div className="quote-form__body">
        <header className="quote-form__head">
          <h1>{stepCopy.title}</h1>
          <p>{stepCopy.subtitle}</p>
        </header>

        {step === 1 && (
          <>
            <section className="quote-form__section" aria-labelledby="quote-form-operation-label">
              <h2 id="quote-form-operation-label" className="quote-form__section-label">
                <GearIcon />
                {form.sections.operation}
              </h2>

              <div className="quote-form__cards quote-form__cards--two">
                {form.operations.map((option) => (
                  <SelectionCard
                    key={option.id}
                    option={option}
                    isSelected={operationType === option.id}
                    onSelect={handleOperationSelect}
                    icon={OperationIcon}
                  />
                ))}
              </div>
            </section>

            <section className="quote-form__section" aria-labelledby="quote-form-transport-label">
              <h2 id="quote-form-transport-label" className="quote-form__section-label">
                <TruckIcon />
                {form.sections.transport}
              </h2>

              <div className="quote-form__cards quote-form__cards--three">
                {form.transports.map((option) => (
                  <SelectionCard
                    key={option.id}
                    option={option}
                    isSelected={transportMode === option.id}
                    onSelect={handleTransportSelect}
                    icon={TransportModeIcon}
                  />
                ))}
              </div>
            </section>

            {hasStep1Selections && (
              <SelectionSummary operation={selectedOperation} transport={selectedTransport} />
            )}
          </>
        )}

        {step === 2 && (
          <>
            {isFcl && (
              <section className="quote-form__section" aria-labelledby="quote-form-container-label">
                <h2 id="quote-form-container-label" className="quote-form__section-label">
                  <CubeIcon />
                  {form.sections.containerType}
                </h2>
                <FieldSelect
                  id="quote-route-container-type"
                  label={form.fields.containerType}
                  value={cargo.containerType}
                  onChange={handleContainerTypeChange}
                  options={form.containerTypes}
                  placeholder={form.placeholders.containerType}
                />
                {!cargo.containerType && (
                  <p className="quote-form__summary-hint">
                    {form.hints.containerFirst}
                  </p>
                )}
              </section>
            )}

            {isFcl && !cargo.containerType ? null : routesLoading ? (
              <div className="quote-form__loader" role="status" aria-live="polite">
                <span className="quote-form__spinner" aria-hidden="true" />
                <p>{form.loading.routes}</p>
              </div>
            ) : routesError !== null ? (
              <section className="quote-form__placeholder" aria-live="polite">
                <p className="quote-form__error">{routesError || form.errors.routes}</p>
                <button
                  type="button"
                  className="quote-form__nav quote-form__nav--next"
                  onClick={() => setRoutesReloadKey((current) => current + 1)}
                  style={{ marginTop: '0.75rem' }}
                >
                  {form.nav.retry}
                </button>
              </section>
            ) : (
              <>
                {isFcl &&
                  originCountries.length === 0 &&
                  destinationCountries.length === 0 && (
                    <section className="quote-form__placeholder" aria-live="polite">
                      <p className="quote-form__error">
                        {form.errors.noRoutesForContainer}
                      </p>
                    </section>
                  )}

                {(originCountries.length > 0 || destinationCountries.length > 0) && (
                  <>
                    <section className="quote-form__section" aria-labelledby="quote-form-origin-label">
                      <h2 id="quote-form-origin-label" className="quote-form__section-label">
                        <PinIcon />
                        {form.sections.originCountry}
                      </h2>

                      <div className="quote-form__route-grid">
                        {originLockedCountry ? (
                          <LockedCountryField
                            name={originLockedCountry.name}
                            hint={form.hints.lockedCountry}
                          />
                        ) : (
                          <FieldSelect
                            id="quote-origin-country"
                            label={form.fields.country}
                            value={originCountryId}
                            onChange={handleOriginCountryChange}
                            options={originCountries}
                            placeholder={form.placeholders.country}
                          />
                        )}
                        <FieldSelect
                          id="quote-origin-port"
                          label={locationPointLabel}
                          value={originPortId}
                          onChange={(event) => setOriginPortId(event.target.value)}
                          options={originPorts}
                          placeholder={
                            originCountryId
                              ? form.placeholders.point(locationPointLabelLower)
                              : form.placeholders.pointLocked
                          }
                          disabled={!originCountryId}
                        />
                      </div>
                    </section>

                    <section
                      className="quote-form__section"
                      aria-labelledby="quote-form-destination-label"
                    >
                      <h2 id="quote-form-destination-label" className="quote-form__section-label">
                        <PinIcon />
                        {form.sections.destinationCountry}
                      </h2>

                      <div className="quote-form__route-grid">
                        {destinationLockedCountry ? (
                          <LockedCountryField
                            name={destinationLockedCountry.name}
                            hint={form.hints.lockedCountry}
                          />
                        ) : (
                          <FieldSelect
                            id="quote-destination-country"
                            label={form.fields.country}
                            value={destinationCountryId}
                            onChange={handleDestinationCountryChange}
                            options={destinationCountries}
                            placeholder={form.placeholders.country}
                          />
                        )}
                        <FieldSelect
                          id="quote-destination-port"
                          label={locationPointLabel}
                          value={destinationPortId}
                          onChange={(event) => setDestinationPortId(event.target.value)}
                          options={destinationPorts}
                          placeholder={
                            destinationCountryId
                              ? form.placeholders.point(locationPointLabelLower)
                              : form.placeholders.pointLocked
                          }
                          disabled={!destinationCountryId}
                        />
                      </div>
                    </section>

                    {originLabel && destinationLabel && (
                      <RouteSummary originLabel={originLabel} destinationLabel={destinationLabel} />
                    )}
                  </>
                )}
              </>
            )}
          </>
        )}

        {step === 3 && (
          <>
            <section className="quote-form__section" aria-labelledby="quote-form-cargo-label">
              <h2 id="quote-form-cargo-label" className="quote-form__section-label">
                <CubeIcon />
                {cargoSectionTitle}
              </h2>

              <div className="quote-form__cargo-layout">
                <div className="quote-form__cargo">
                  {isFcl ? (
                    <FieldInput
                      id="quote-cargo-quantity"
                      label={form.fields.containerQuantity}
                      type="number"
                      inputMode="numeric"
                      min="1"
                      step="1"
                      value={cargo.quantity}
                      onChange={updateCargoField('quantity')}
                    />
                  ) : (
                    <>
                      <FieldInput
                        id="quote-cargo-quantity"
                        label={form.fields.cargoQuantity}
                        type="number"
                        inputMode="numeric"
                        min="1"
                        step="1"
                        value={cargo.quantity}
                        onChange={updateCargoField('quantity')}
                      />

                      <div className="quote-form__cargo-dims">
                        <FieldInput
                          id="quote-cargo-length"
                          label={form.fields.length}
                          type="number"
                          inputMode="decimal"
                          min="0"
                          step="0.01"
                          placeholder={form.placeholders.decimal}
                          value={cargo.length}
                          onChange={updateCargoField('length')}
                        />
                        <FieldInput
                          id="quote-cargo-width"
                          label={form.fields.width}
                          type="number"
                          inputMode="decimal"
                          min="0"
                          step="0.01"
                          placeholder={form.placeholders.decimal}
                          value={cargo.width}
                          onChange={updateCargoField('width')}
                        />
                        <FieldInput
                          id="quote-cargo-height"
                          label={form.fields.height}
                          type="number"
                          inputMode="decimal"
                          min="0"
                          step="0.01"
                          placeholder={form.placeholders.decimal}
                          value={cargo.height}
                          onChange={updateCargoField('height')}
                        />
                      </div>

                      <FieldInput
                        id="quote-cargo-weight"
                        label={form.fields.weight}
                        type="number"
                        inputMode="decimal"
                        min="0"
                        step="0.01"
                        placeholder={form.placeholders.decimal}
                        value={cargo.weight}
                        onChange={updateCargoField('weight')}
                      />
                    </>
                  )}

                  <FieldInput
                    id="quote-cargo-declared-value"
                    label={form.fields.declaredValue}
                    type="number"
                    inputMode="decimal"
                    min="0"
                    step="0.01"
                    placeholder={form.placeholders.decimal}
                    value={cargo.declaredValueUsd}
                    onChange={updateCargoField('declaredValueUsd')}
                  />
                  <p className="quote-form__summary-hint">
                    {isFcl ? form.hints.declaredValueFcl : form.hints.declaredValue}
                  </p>
                </div>

                {!isFcl && cargoMetrics && <CargoMetricsPanel metrics={cargoMetrics} />}
              </div>
            </section>

            {cargoMetrics?.isComplete && hasDeclaredValue && (
              isFcl ? (
                <FclCargoSummary
                  metrics={cargoMetrics}
                  declaredValueUsd={declaredValueNumber}
                />
              ) : (
                <CargoSummary
                  metrics={cargoMetrics}
                  declaredValueUsd={declaredValueNumber}
                />
              )
            )}
          </>
        )}

        {step === 4 && (
          summaryLoading || !quoteMeta || !cargoMetrics ? (
            <QuoteSummaryLoader />
          ) : (
            <QuoteReview
              quoteMeta={quoteMeta}
              operation={selectedOperation}
              transport={selectedTransport}
              originCountry={originCountry}
              originPort={originPort}
              destinationCountry={destinationCountry}
              destinationPort={destinationPort}
              cargoMetrics={cargoMetrics}
              declaredValueUsd={declaredValueNumber}
              onEditStep={handleEditStep}
            />
          )
        )}

        {step === 5 && (
          quoteSubmitted ? (
            <QuoteSuccess
              email={contact.email.trim()}
              quoteNumber={quoteMeta?.number}
              onFinish={onBack}
            />
          ) : (
            <ContactStepForm
              contact={contact}
              onChange={handleContactChange}
              errorMessage={submitError}
              disabled={submitting}
              turnstileRef={turnstileRef}
              onCaptchaSuccess={setCaptchaToken}
              onCaptchaClear={clearCaptcha}
              acceptedDataPolicy={acceptedDataPolicy}
              onAcceptedDataPolicyChange={setAcceptedDataPolicy}
            />
          )
        )}
      </div>

      {!quoteSubmitted && (
        <footer className="quote-form__footer">
          <button type="button" className="quote-form__nav quote-form__nav--back" onClick={handleBack}>
            <ArrowLeftIcon />
            {form.nav.back}
          </button>
          <button
            type="button"
            className="quote-form__nav quote-form__nav--next"
            disabled={!canContinue}
            onClick={handleContinue}
          >
            {step === 5
              ? submitting
                ? form.nav.submitting
                : form.nav.submit
              : form.nav.continue}
            {step === 5 ? null : <ArrowRightIcon />}
          </button>
        </footer>
      )}
    </article>
  )
}
