import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'

const STORAGE_KEY = 'easy-lang'

export const LANGUAGES = ['es', 'en']
export const DEFAULT_LANGUAGE = 'es'

const LanguageContext = createContext({
  lang: DEFAULT_LANGUAGE,
  setLang: () => {},
  toggleLang: () => {},
})

function isSupported(value) {
  return typeof value === 'string' && LANGUAGES.includes(value)
}

/** Preferencia guardada → idioma del navegador → español. */
function readInitialLanguage() {
  if (typeof window === 'undefined') return DEFAULT_LANGUAGE

  try {
    const stored = window.localStorage.getItem(STORAGE_KEY)
    if (isSupported(stored)) return stored
  } catch {
    // almacenamiento bloqueado: seguimos con la detección del navegador
  }

  const navLang = window.navigator?.language?.slice(0, 2).toLowerCase()
  return navLang === 'en' ? 'en' : DEFAULT_LANGUAGE
}

export function LanguageProvider({ children }) {
  const [lang, setLangState] = useState(readInitialLanguage)

  useEffect(() => {
    document.documentElement.lang = lang
    try {
      window.localStorage.setItem(STORAGE_KEY, lang)
    } catch {
      // sin persistencia: la sesión actual sigue funcionando
    }
  }, [lang])

  const setLang = useCallback((next) => {
    if (!isSupported(next)) return
    setLangState(next)
  }, [])

  const toggleLang = useCallback(() => {
    setLangState((current) => (current === 'es' ? 'en' : 'es'))
  }, [])

  const value = useMemo(() => ({ lang, setLang, toggleLang }), [lang, setLang, toggleLang])

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  return useContext(LanguageContext)
}
