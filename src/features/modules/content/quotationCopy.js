/**
 * Punto de entrada del copy del cotizador.
 * Mismo patrón que la landing: un deck por idioma y un hook que
 * devuelve el activo según el LanguageContext.
 */
import { useLanguage } from '../../../i18n/LanguageContext'
import { ES } from './quotationCopy.es'
import { EN } from './quotationCopy.en'

export const QUOTE_DECKS = { es: ES, en: EN }

export function useQuotationCopy() {
  const { lang } = useLanguage()
  return QUOTE_DECKS[lang] ?? QUOTE_DECKS.es
}
