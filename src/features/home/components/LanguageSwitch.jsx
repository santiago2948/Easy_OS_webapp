import { LANGUAGES, useLanguage } from '../../../i18n/LanguageContext'

/**
 * Selector ES / EN. Pastilla compacta con marcador deslizante.
 */
export default function LanguageSwitch({ label = 'Idioma' }) {
  const { lang, setLang } = useLanguage()

  return (
    <div className="lang-switch" data-lang={lang} role="group" aria-label={label}>
      <span className="lang-switch__thumb" aria-hidden="true" />
      {LANGUAGES.map((code) => (
        <button
          key={code}
          type="button"
          className={`lang-switch__opt${code === lang ? ' is-active' : ''}`}
          aria-pressed={code === lang}
          onClick={() => setLang(code)}
        >
          {code.toUpperCase()}
        </button>
      ))}
    </div>
  )
}
