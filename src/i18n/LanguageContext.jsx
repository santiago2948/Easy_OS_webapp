import { createContext, useCallback, useContext, useEffect, useMemo } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

export const LANGUAGES = ['es', 'en']
export const DEFAULT_LANGUAGE = 'es'
export const EN_PREFIX = '/en'

/**
 * La URL es la única fuente de verdad del idioma.
 *
 * Antes vivía en localStorage, pero así el inglés no existía para buscadores
 * ni para los rastreadores de IA: una sola URL no puede indexarse en dos
 * idiomas. Con prefijo /en cada versión tiene su dirección y su hreflang.
 */
export function langFromPath(pathname) {
  return pathname === EN_PREFIX || pathname.startsWith(`${EN_PREFIX}/`) ? 'en' : 'es'
}

/** Ruta canónica (español), sin el prefijo de idioma. */
export function stripLangPrefix(pathname) {
  if (pathname === EN_PREFIX) return '/'
  if (pathname.startsWith(`${EN_PREFIX}/`)) return pathname.slice(EN_PREFIX.length)
  return pathname
}

/** Misma ruta en el idioma pedido. */
export function withLang(pathname, lang) {
  const base = stripLangPrefix(pathname)
  if (lang !== 'en') return base
  return base === '/' ? EN_PREFIX : `${EN_PREFIX}${base}`
}

const LanguageContext = createContext({
  lang: DEFAULT_LANGUAGE,
  setLang: () => {},
  toggleLang: () => {},
})

export function LanguageProvider({ children }) {
  const location = useLocation()
  const navigate = useNavigate()
  const lang = langFromPath(location.pathname)

  useEffect(() => {
    document.documentElement.lang = lang
  }, [lang])

  const setLang = useCallback(
    (next) => {
      if (!LANGUAGES.includes(next) || next === lang) return
      navigate(`${withLang(location.pathname, next)}${location.search}${location.hash}`)
    },
    [lang, location.pathname, location.search, location.hash, navigate],
  )

  const toggleLang = useCallback(() => {
    setLang(lang === 'es' ? 'en' : 'es')
  }, [lang, setLang])

  const value = useMemo(() => ({ lang, setLang, toggleLang }), [lang, setLang, toggleLang])

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  return useContext(LanguageContext)
}

/** Prefija una ruta interna con el idioma activo. */
export function useLangPath() {
  const { lang } = useLanguage()
  return useCallback((path) => withLang(path, lang), [lang])
}
