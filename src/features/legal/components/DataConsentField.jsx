import { Link } from 'react-router-dom'
import {
  DATA_POLICY_PATH,
  DATA_POLICY_TITLE,
} from '../content/dataConsent'
import '../styles/legal.css'

function ConsentCheckIcon() {
  return (
    <svg viewBox="0 0 16 16" width="12" height="12" aria-hidden="true">
      <path
        d="M3.2 8.2l3 3 6.6-6.8"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export default function DataConsentField({
  id,
  checked,
  onChange,
  disabled = false,
  notice,
}) {
  return (
    <div className={`legal-consent${checked ? ' is-checked' : ''}${disabled ? ' is-disabled' : ''}`}>
      {notice ? <p className="legal-consent__notice">{notice}</p> : null}

      <label className="legal-consent__card" htmlFor={id}>
        <input
          id={id}
          className="legal-consent__input"
          type="checkbox"
          checked={checked}
          onChange={(event) => onChange(event.target.checked)}
          disabled={disabled}
        />
        <span className="legal-consent__box" aria-hidden="true">
          <ConsentCheckIcon />
        </span>
        <span className="legal-consent__copy">
          Autorizo el tratamiento de mis datos personales de acuerdo con la{' '}
          <Link
            to={DATA_POLICY_PATH}
            target="_blank"
            rel="noreferrer"
            onClick={(event) => event.stopPropagation()}
          >
            {DATA_POLICY_TITLE}
          </Link>
          .
        </span>
      </label>
    </div>
  )
}
