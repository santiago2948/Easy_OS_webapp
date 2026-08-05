import { useEffect, useRef, useState } from 'react'
import { Turnstile } from '@marsidev/react-turnstile'
import DataConsentField from '../../legal/components/DataConsentField'
import {
  DATA_POLICY_VERSION,
  QUOTE_PRIVACY_NOTICE,
} from '../../legal/content/dataConsent'
import { createQuote } from '../api/createQuote'
import { fetchQuoteRoutes } from '../api/fetchQuoteRoutes'
import { findCountry, findPort } from '../content/quotationRoutes'
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

const OPERATION_TYPES = [
  {
    id: 'import',
    title: 'Importación',
    summaryLabel: 'IMPORT',
    description:
      'Trae tus productos desde el extranjero. Te ayudamos con toda la logística de importación.',
    tags: ['Aduanas', 'Transporte', 'Almacenamiento'],
    icon: 'import',
  },
  {
    id: 'export',
    title: 'Exportación',
    summaryLabel: 'EXPORT',
    description:
      'Lleva tus productos al mundo. Gestionamos toda la logística de exportación.',
    tags: ['Documentación', 'Embarque', 'Entrega'],
    icon: 'export',
  },
]

const FCL_CONTAINER_TYPES = [
  { id: '20STD', name: '20STD — Contenedor 20 pies estándar' },
  { id: '40STD', name: '40STD — Contenedor 40 pies estándar' },
  { id: '40HC', name: '40HC — Contenedor 40 pies high cube' },
  { id: '40HC-REEFER', name: '40HC-REEFER — Contenedor reefer 40 pies' },
]

const TRANSPORT_MODES = [
  {
    id: 'fcl',
    title: 'FCL',
    summaryLabel: 'FCL',
    description: 'Full Container Load. Contenedor completo para tu carga exclusiva.',
    tags: ['Contenedor Completo', 'Carga Exclusiva'],
    icon: 'fcl',
  },
  {
    id: 'lcl',
    title: 'LCL',
    summaryLabel: 'LCL',
    description: 'Less than Container Load. Comparte contenedor con otras cargas.',
    tags: ['Carga Parcial', 'Económico'],
    icon: 'lcl',
  },
  {
    id: 'air',
    title: 'Aéreo',
    summaryLabel: 'AÉREO',
    description: 'Transporte aéreo. Ideal para cargas urgentes y de alto valor.',
    tags: ['Rápido', 'Urgente'],
    icon: 'air',
  },
]

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
        <Icon name={option.icon} />
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
  return (
    <section className="quote-form__summary" aria-live="polite">
      <div className="quote-form__summary-head">
        <span className="quote-form__summary-icon">
          <CheckIcon />
        </span>
        <h2>Resumen de tu selección</h2>
      </div>

      <div className="quote-form__summary-grid">
        {operation && (
          <div className="quote-form__summary-item">
            <span className="quote-form__summary-label">Tipo de Operación:</span>
            <span className="quote-form__summary-badge">{operation.summaryLabel}</span>
          </div>
        )}
        {transport && (
          <div className="quote-form__summary-item">
            <span className="quote-form__summary-label">Modo de Transporte:</span>
            <span className="quote-form__summary-badge">{transport.summaryLabel}</span>
          </div>
        )}
      </div>
    </section>
  )
}

function RouteSummary({ originLabel, destinationLabel }) {
  return (
    <section className="quote-form__summary" aria-live="polite">
      <div className="quote-form__summary-head">
        <span className="quote-form__summary-icon">
          <CheckIcon />
        </span>
        <h2>Resumen de Origen y Destino</h2>
      </div>

      <div className="quote-form__summary-grid">
        <div className="quote-form__summary-item">
          <span className="quote-form__summary-label">Origen:</span>
          <span className="quote-form__summary-badge quote-form__summary-badge--route">
            {originLabel}
          </span>
        </div>
        <div className="quote-form__summary-item">
          <span className="quote-form__summary-label">Destino:</span>
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

/** Ocean LCL/Air: W/M from dimensions. FCL: fixed rate per container type. */
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
      containerLabel:
        FCL_CONTAINER_TYPES.find((item) => item.id === containerType)?.name ?? containerType,
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
  const volumetricTons = volumeM3
  const hasWeight = Number.isFinite(weightKg) && weightKg > 0
  const actualTons = hasWeight ? (weightKg * quantity) / 1000 : null
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
  return (
    <aside className="quote-form__cargo-metrics" aria-live="polite">
      <div className="quote-form__cargo-metric">
        <strong>Volumen Calculado</strong>
        <span>{formatMetric(metrics.volumeM3)} m³</span>
      </div>
      <div className="quote-form__cargo-metric">
        <strong>Peso Volumétrico</strong>
        <span>{formatMetric(metrics.volumetricTons)} TON</span>
      </div>
      <div className="quote-form__cargo-metric">
        <strong>Peso Tasable</strong>
        <span>{formatMetric(metrics.chargeableTons)} TON</span>
        <small>Peso al que se aplicará la tarifa</small>
      </div>
    </aside>
  )
}

function FclCargoSummary({ metrics, declaredValueUsd }) {
  return (
    <section className="quote-form__summary" aria-live="polite">
      <div className="quote-form__summary-head">
        <span className="quote-form__summary-icon">
          <CheckIcon />
        </span>
        <h2>Resumen de Datos de Carga</h2>
      </div>

      <div className="quote-form__summary-grid quote-form__summary-grid--cargo">
        <div className="quote-form__summary-item">
          <span className="quote-form__summary-label">Tipo de contenedor:</span>
          <span className="quote-form__summary-badge quote-form__summary-badge--route">
            {metrics.containerType}
          </span>
        </div>
        <div className="quote-form__summary-item">
          <span className="quote-form__summary-label">Cantidad:</span>
          <span className="quote-form__summary-badge">{metrics.quantity}</span>
        </div>
        <div className="quote-form__summary-item">
          <span className="quote-form__summary-label">Valor declarado:</span>
          <span className="quote-form__summary-badge quote-form__summary-badge--soft">
            USD {Number(declaredValueUsd).toLocaleString('en-US')}
          </span>
        </div>
      </div>
    </section>
  )
}

function CargoSummary({ metrics, declaredValueUsd }) {
  const dimensionsLabel = `${metrics.length} x ${metrics.width} x ${metrics.height} m`

  return (
    <section className="quote-form__summary" aria-live="polite">
      <div className="quote-form__summary-head">
        <span className="quote-form__summary-icon">
          <CheckIcon />
        </span>
        <h2>Resumen de Datos de Carga</h2>
      </div>

      <div className="quote-form__summary-grid quote-form__summary-grid--cargo">
        <div className="quote-form__summary-col">
          <div className="quote-form__summary-item">
            <span className="quote-form__summary-label">Cantidad:</span>
            <span className="quote-form__summary-badge">{metrics.quantity}</span>
          </div>
          <div className="quote-form__summary-item">
            <span className="quote-form__summary-label">Dimensiones:</span>
            <span className="quote-form__summary-badge quote-form__summary-badge--route">
              {dimensionsLabel}
            </span>
          </div>
          <div className="quote-form__summary-item">
            <span className="quote-form__summary-label">Peso:</span>
            <span className="quote-form__summary-badge quote-form__summary-badge--soft">
              {metrics.weightKg} kg
            </span>
          </div>
          <div className="quote-form__summary-item">
            <span className="quote-form__summary-label">Valor declarado:</span>
            <span className="quote-form__summary-badge quote-form__summary-badge--soft">
              USD {Number(declaredValueUsd).toLocaleString('en-US')}
            </span>
          </div>
        </div>

        <div className="quote-form__summary-col">
          <div className="quote-form__summary-item">
            <span className="quote-form__summary-label">Volumen:</span>
            <span className="quote-form__summary-badge quote-form__summary-badge--soft">
              {formatMetric(metrics.volumeM3)} m³
            </span>
          </div>
          <div className="quote-form__summary-item">
            <span className="quote-form__summary-label">Peso Volumétrico:</span>
            <span className="quote-form__summary-badge quote-form__summary-badge--soft">
              {formatMetric(metrics.volumetricTons)} TON
            </span>
          </div>
          <div className="quote-form__summary-item quote-form__summary-item--stack">
            <div className="quote-form__summary-item-row">
              <span className="quote-form__summary-label">Peso Tasable:</span>
              <span className="quote-form__summary-badge quote-form__summary-badge--soft">
                {formatMetric(metrics.chargeableTons)} TON
              </span>
            </div>
            <small className="quote-form__summary-hint">Peso al que se aplicará la tarifa</small>
          </div>
        </div>
      </div>
    </section>
  )
}

function LockedCountryField({ name, hint }) {
  return (
    <div className="quote-form__field">
      <span className="quote-form__field-label">País</span>
      <div className="quote-form__locked-country" aria-live="polite">
        <strong>{name}</strong>
        <span>{hint}</span>
      </div>
    </div>
  )
}

function formatQuoteDate(date) {
  return new Intl.DateTimeFormat('es-CO', {
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

function ReviewSection({ icon: Icon, title, onEdit, editLabel = 'Editar', children }) {
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
            {editLabel}
          </button>
        )}
      </header>
      <div className="quote-form__review-body">{children}</div>
    </section>
  )
}

function QuoteSummaryLoader() {
  return (
    <div className="quote-form__loader" role="status" aria-live="polite">
      <span className="quote-form__spinner" aria-hidden="true" />
      <p>Cargando el resumen de su cotización…</p>
    </div>
  )
}

function QuoteSuccess({ email, quoteNumber, onFinish }) {
  return (
    <section className="quote-form__success" role="status" aria-live="polite">
      <span className="quote-form__success-icon" aria-hidden="true">
        <CheckIcon />
      </span>
      <h2>¡Cotización enviada!</h2>
      <p>
        Recibirás un correo en <strong>{email}</strong> con el resultado de tu cotización
        {quoteNumber ? (
          <>
            {' '}
            (<strong>{quoteNumber}</strong>)
          </>
        ) : null}
        .
      </p>
      <button type="button" className="quote-form__nav quote-form__nav--next" onClick={onFinish}>
        Volver al inicio
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
  return (
    <section className="quote-form__section" aria-labelledby="quote-form-contact-label">
      <h2 id="quote-form-contact-label" className="quote-form__section-label">
        <InfoIcon />
        Datos de contacto
      </h2>

      <div className="quote-form__contact">
        <FieldInput
          id="quote-contact-name"
          label="Nombre completo"
          type="text"
          placeholder="Tu nombre"
          value={contact.name}
          onChange={(event) => onChange('name', event.target.value)}
          disabled={disabled}
        />

        <FieldInput
          id="quote-contact-email"
          label="Correo electrónico"
          type="email"
          inputMode="email"
          placeholder="tu@correo.com"
          value={contact.email}
          onChange={(event) => onChange('email', event.target.value)}
          disabled={disabled}
        />

        <div className="quote-form__field">
          <span className="quote-form__field-label" id="quote-contact-phone-label">
            Teléfono celular
          </span>
          <div className="quote-form__phone-row" role="group" aria-labelledby="quote-contact-phone-label">
            <label className="visually-hidden" htmlFor="quote-contact-dial">
              Código de país
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
              placeholder="320 123 4567"
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
          notice={QUOTE_PRIVACY_NOTICE}
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
            Falta configurar VITE_TURNSTILE_SITE_KEY.
          </p>
        )}

        {errorMessage ? (
          <p className="quote-form__error" role="alert">
            {errorMessage}
          </p>
        ) : null}

        <p className="quote-form__contact-note">
          Al enviar, te enviaremos un correo con el resultado de tu cotización.
        </p>
      </div>
    </section>
  )
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
  const isFcl = cargoMetrics?.mode === 'fcl'

  return (
    <div className="quote-form__review">
      <ReviewSection icon={InfoIcon} title="Información de la Cotización">
        <div className="quote-form__review-grid">
          <div className="quote-form__summary-item">
            <span className="quote-form__summary-label">Número de Cotización:</span>
            <ReviewBadge tone="soft">
              {quoteMeta.number ?? 'Se asignará al confirmar'}
            </ReviewBadge>
          </div>
          <div className="quote-form__summary-item">
            <span className="quote-form__summary-label">Fecha de Creación:</span>
            <span className="quote-form__review-text">{formatQuoteDate(quoteMeta.createdAt)}</span>
          </div>
        </div>
      </ReviewSection>

      <ReviewSection
        icon={GearIcon}
        title="Configuración de Operación"
        onEdit={() => onEditStep(1)}
      >
        <div className="quote-form__review-grid">
          <div className="quote-form__summary-item">
            <span className="quote-form__summary-label">Tipo de Operación:</span>
            <ReviewBadge>{operation?.title?.toUpperCase()}</ReviewBadge>
          </div>
          <div className="quote-form__summary-item">
            <span className="quote-form__summary-label">Modo de Transporte:</span>
            <ReviewBadge>{transport?.summaryLabel}</ReviewBadge>
          </div>
        </div>
      </ReviewSection>

      <ReviewSection icon={PinIcon} title="Origen y Destino" onEdit={() => onEditStep(2)}>
        <div className="quote-form__review-route">
          <div className="quote-form__review-route-block">
            <h3>
              <RouteArrowIcon direction="up" />
              Origen
            </h3>
            <p>
              <strong>País:</strong> {originCountry?.name}
            </p>
            <p>
              <strong>Puerto:</strong> {originPort?.name}
            </p>
          </div>
          <div className="quote-form__review-route-block">
            <h3>
              <RouteArrowIcon direction="down" />
              Destino
            </h3>
            <p>
              <strong>País:</strong> {destinationCountry?.name}
            </p>
            <p>
              <strong>Puerto:</strong> {destinationPort?.name}
            </p>
          </div>
        </div>
      </ReviewSection>

      <ReviewSection icon={CubeIcon} title="Información de Carga" onEdit={() => onEditStep(3)}>
        {isFcl ? (
          <div className="quote-form__review-grid quote-form__review-grid--cargo">
            <div className="quote-form__summary-item">
              <span className="quote-form__summary-label">Tipo de contenedor:</span>
              <ReviewBadge tone="soft">{cargoMetrics.containerType}</ReviewBadge>
            </div>
            <div className="quote-form__summary-item">
              <span className="quote-form__summary-label">Cantidad de contenedores:</span>
              <ReviewBadge>{cargoMetrics.quantity}</ReviewBadge>
            </div>
            <div className="quote-form__summary-item">
              <span className="quote-form__summary-label">Valor declarado:</span>
              <ReviewBadge tone="soft">
                USD {Number(declaredValueUsd).toLocaleString('en-US')}
              </ReviewBadge>
            </div>
          </div>
        ) : (
          <>
            <div className="quote-form__review-grid quote-form__review-grid--cargo">
              <div className="quote-form__summary-item">
                <span className="quote-form__summary-label">Cantidad de Cargas:</span>
                <ReviewBadge>{cargoMetrics.quantity}</ReviewBadge>
              </div>
              <div className="quote-form__summary-item">
                <span className="quote-form__summary-label">Dimensiones:</span>
                <ReviewBadge tone="soft">
                  {cargoMetrics.length} x {cargoMetrics.width} x {cargoMetrics.height} m
                </ReviewBadge>
              </div>
              <div className="quote-form__summary-item">
                <span className="quote-form__summary-label">Peso:</span>
                <ReviewBadge tone="soft">{cargoMetrics.weightKg} kg</ReviewBadge>
              </div>
              <div className="quote-form__summary-item">
                <span className="quote-form__summary-label">Volumen:</span>
                <ReviewBadge tone="soft">{formatMetric(cargoMetrics.volumeM3)} m³</ReviewBadge>
              </div>
              <div className="quote-form__summary-item">
                <span className="quote-form__summary-label">Peso Volumétrico:</span>
                <ReviewBadge tone="soft">{formatMetric(cargoMetrics.volumetricTons)} TON</ReviewBadge>
              </div>
              <div className="quote-form__summary-item">
                <span className="quote-form__summary-label">Peso Tasable:</span>
                <ReviewBadge tone="soft">{formatMetric(cargoMetrics.chargeableTons)} TON</ReviewBadge>
              </div>
              <div className="quote-form__summary-item">
                <span className="quote-form__summary-label">Valor declarado:</span>
                <ReviewBadge tone="soft">
                  USD {Number(declaredValueUsd).toLocaleString('en-US')}
                </ReviewBadge>
              </div>
            </div>
            <p className="quote-form__review-note">
              <InfoIcon />
              El peso tasable es el peso al que se aplicará la tarifa.
            </p>
          </>
        )}
      </ReviewSection>
    </div>
  )
}

export default function QuotationForm({ onBack }) {
  const [step, setStep] = useState(1)
  const [operationType, setOperationType] = useState(null)
  const [transportMode, setTransportMode] = useState(null)
  const [originCountryId, setOriginCountryId] = useState('')
  const [originPortId, setOriginPortId] = useState('')
  const [destinationCountryId, setDestinationCountryId] = useState('')
  const [destinationPortId, setDestinationPortId] = useState('')
  const [routeOptions, setRouteOptions] = useState(null)
  const [routesLoading, setRoutesLoading] = useState(false)
  const [routesError, setRoutesError] = useState('')
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

  const selectedOperation = OPERATION_TYPES.find((item) => item.id === operationType)
  const selectedTransport = TRANSPORT_MODES.find((item) => item.id === transportMode)
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

  const stepCopyByStep = {
    1: {
      title: 'Configura tu operación logística',
      subtitle: 'Selecciona el tipo de operación y el modo de transporte',
    },
    2: {
      title: isFcl ? 'Contenedor, origen y destino' : 'Origen y Destino',
      subtitle: isFcl
        ? 'Selecciona el tipo de contenedor y luego el origen y destino disponibles'
        : 'Selecciona el país y puerto de origen y destino',
    },
    3: {
      title: 'Datos de la Carga',
      subtitle: isFcl
        ? 'Indica la cantidad de contenedores y el valor declarado'
        : 'Ingresa los datos de tu carga',
    },
    4: {
      title: 'Resumen de su cotización',
      subtitle: summaryLoading
        ? 'Estamos preparando tu resumen'
        : 'Revisa los datos antes de continuar',
    },
    5: {
      title: quoteSubmitted ? 'Cotización enviada' : 'Datos de contacto',
      subtitle: quoteSubmitted
        ? 'Revisa tu correo para el resultado'
        : 'Ingresa tus datos para enviarte el resultado de la cotización',
    },
  }
  const stepCopy = stepCopyByStep[step] ?? {
    title: `Paso ${step}`,
    subtitle: 'Continúa completando tu cotización',
  }

  const cargoSectionTitle = selectedTransport
    ? `Datos de la Carga ${selectedTransport.title}`
    : 'Datos de la Carga'

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
    setRoutesError('')
  }

  useEffect(() => {
    if (step !== 2 || !operationType || !transportMode) return undefined
    if (isFcl && !cargo.containerType) {
      setRouteOptions(null)
      setRoutesError('')
      setRoutesLoading(false)
      return undefined
    }

    let cancelled = false
    setRoutesLoading(true)
    setRoutesError('')

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
        setRoutesError(error.message || 'No se pudieron cargar orígenes y destinos')
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
    setRoutesError('')
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
      setSubmitError(error.message || 'No se pudo enviar la cotización')
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
          <span>
            Paso {step} de {TOTAL_STEPS}
          </span>
          <span>{progress}% completado</span>
        </div>
        <div
          className="quote-form__progress-bar"
          role="progressbar"
          aria-valuenow={progress}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`Progreso de cotización: ${progress}%`}
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
                Tipo de Operación
              </h2>

              <div className="quote-form__cards quote-form__cards--two">
                {OPERATION_TYPES.map((option) => (
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
                Modo de Transporte
              </h2>

              <div className="quote-form__cards quote-form__cards--three">
                {TRANSPORT_MODES.map((option) => (
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
                  Tipo de contenedor
                </h2>
                <FieldSelect
                  id="quote-route-container-type"
                  label="Tipo de contenedor"
                  value={cargo.containerType}
                  onChange={handleContainerTypeChange}
                  options={FCL_CONTAINER_TYPES}
                  placeholder="Selecciona un tipo de contenedor"
                />
                {!cargo.containerType && (
                  <p className="quote-form__summary-hint">
                    Elige el contenedor para ver solo los orígenes y destinos disponibles en CRM.
                  </p>
                )}
              </section>
            )}

            {isFcl && !cargo.containerType ? null : routesLoading ? (
              <div className="quote-form__loader" role="status" aria-live="polite">
                <span className="quote-form__spinner" aria-hidden="true" />
                <p>Cargando orígenes y destinos…</p>
              </div>
            ) : routesError ? (
              <section className="quote-form__placeholder" aria-live="polite">
                <p className="quote-form__error">{routesError}</p>
                <button
                  type="button"
                  className="quote-form__nav quote-form__nav--next"
                  onClick={() => setRoutesReloadKey((current) => current + 1)}
                  style={{ marginTop: '0.75rem' }}
                >
                  Reintentar
                </button>
              </section>
            ) : (
              <>
                {isFcl &&
                  originCountries.length === 0 &&
                  destinationCountries.length === 0 && (
                    <section className="quote-form__placeholder" aria-live="polite">
                      <p className="quote-form__error">
                        No hay rutas configuradas en CRM para este tipo de contenedor.
                      </p>
                    </section>
                  )}

                {(originCountries.length > 0 || destinationCountries.length > 0) && (
                  <>
                    <section className="quote-form__section" aria-labelledby="quote-form-origin-label">
                      <h2 id="quote-form-origin-label" className="quote-form__section-label">
                        <PinIcon />
                        País de Origen
                      </h2>

                      <div className="quote-form__route-grid">
                        {originLockedCountry ? (
                          <LockedCountryField
                            name={originLockedCountry.name}
                            hint="País seleccionado"
                          />
                        ) : (
                          <FieldSelect
                            id="quote-origin-country"
                            label="País"
                            value={originCountryId}
                            onChange={handleOriginCountryChange}
                            options={originCountries}
                            placeholder="Selecciona un país"
                          />
                        )}
                        <FieldSelect
                          id="quote-origin-port"
                          label="Puerto"
                          value={originPortId}
                          onChange={(event) => setOriginPortId(event.target.value)}
                          options={originPorts}
                          placeholder={originCountryId ? 'Selecciona un puerto' : 'Primero elige el país'}
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
                        País de Destino
                      </h2>

                      <div className="quote-form__route-grid">
                        {destinationLockedCountry ? (
                          <LockedCountryField
                            name={destinationLockedCountry.name}
                            hint="País seleccionado"
                          />
                        ) : (
                          <FieldSelect
                            id="quote-destination-country"
                            label="País"
                            value={destinationCountryId}
                            onChange={handleDestinationCountryChange}
                            options={destinationCountries}
                            placeholder="Selecciona un país"
                          />
                        )}
                        <FieldSelect
                          id="quote-destination-port"
                          label="Puerto"
                          value={destinationPortId}
                          onChange={(event) => setDestinationPortId(event.target.value)}
                          options={destinationPorts}
                          placeholder={
                            destinationCountryId ? 'Selecciona un puerto' : 'Primero elige el país'
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
                      label="Cantidad de contenedores"
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
                        label="Cantidad de Cargas"
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
                          label="Largo (metros)"
                          type="number"
                          inputMode="decimal"
                          min="0"
                          step="0.01"
                          placeholder="0.00"
                          value={cargo.length}
                          onChange={updateCargoField('length')}
                        />
                        <FieldInput
                          id="quote-cargo-width"
                          label="Ancho (metros)"
                          type="number"
                          inputMode="decimal"
                          min="0"
                          step="0.01"
                          placeholder="0.00"
                          value={cargo.width}
                          onChange={updateCargoField('width')}
                        />
                        <FieldInput
                          id="quote-cargo-height"
                          label="Alto (metros)"
                          type="number"
                          inputMode="decimal"
                          min="0"
                          step="0.01"
                          placeholder="0.00"
                          value={cargo.height}
                          onChange={updateCargoField('height')}
                        />
                      </div>

                      <FieldInput
                        id="quote-cargo-weight"
                        label="Peso (kg)"
                        type="number"
                        inputMode="decimal"
                        min="0"
                        step="0.01"
                        placeholder="0.00"
                        value={cargo.weight}
                        onChange={updateCargoField('weight')}
                      />
                    </>
                  )}

                  <FieldInput
                    id="quote-cargo-declared-value"
                    label="Valor declarado de la carga (USD)"
                    type="number"
                    inputMode="decimal"
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                    value={cargo.declaredValueUsd}
                    onChange={updateCargoField('declaredValueUsd')}
                  />
                  <p className="quote-form__summary-hint">
                    {isFcl
                      ? 'Requerido para el cálculo del seguro y otros conceptos porcentuales.'
                      : 'Monto en dólares estadounidenses. Requerido para seguros y conceptos porcentuales.'}
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
            Volver
          </button>
          <button
            type="button"
            className="quote-form__nav quote-form__nav--next"
            disabled={!canContinue}
            onClick={handleContinue}
          >
            {step === 5 ? (submitting ? 'Enviando…' : 'Enviar cotización') : 'Continuar'}
            {step === 5 ? null : <ArrowRightIcon />}
          </button>
        </footer>
      )}
    </article>
  )
}
