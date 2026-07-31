import { useState } from 'react'
import '../styles/quotation-form.css'

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

export default function QuotationForm({ onBack }) {
  const [step, setStep] = useState(1)
  const [operationType, setOperationType] = useState(null)
  const [transportMode, setTransportMode] = useState(null)

  const selectedOperation = OPERATION_TYPES.find((item) => item.id === operationType)
  const selectedTransport = TRANSPORT_MODES.find((item) => item.id === transportMode)
  const hasSelections = Boolean(operationType || transportMode)
  const isStepComplete = Boolean(operationType && transportMode)

  const progress = Math.round((step / TOTAL_STEPS) * 100)

  return (
    <article className="quote-form">
      <div className="quote-form__progress">
        <div className="quote-form__progress-meta">
          <span>Paso {step} de {TOTAL_STEPS}</span>
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
          <h1>Configura tu operación logística</h1>
          <p>Selecciona el tipo de operación y el modo de transporte</p>
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
                    onSelect={setOperationType}
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
                    onSelect={setTransportMode}
                    icon={TransportModeIcon}
                  />
                ))}
              </div>
            </section>
          </>
        )}

        {hasSelections && (
          <SelectionSummary operation={selectedOperation} transport={selectedTransport} />
        )}
      </div>

      <footer className="quote-form__footer">
        <button type="button" className="quote-form__nav quote-form__nav--back" onClick={onBack}>
          <ArrowLeftIcon />
          Volver
        </button>
        <button
          type="button"
          className="quote-form__nav quote-form__nav--next"
          disabled={!isStepComplete}
          onClick={() => setStep((current) => Math.min(current + 1, TOTAL_STEPS))}
        >
          Continuar
          <ArrowRightIcon />
        </button>
      </footer>
    </article>
  )
}
