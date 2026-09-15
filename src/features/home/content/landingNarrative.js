/**
 * Punto de entrada de la narrativa de la landing.
 *
 * El texto vive en un deck por idioma (landingNarrative.es.js / .en.js).
 * Aquí queda todo lo que NO se traduce: contacto, rutas, anclas de sección
 * y las imágenes asociadas a cada bloque, para que ambos idiomas compartan
 * la misma media sin duplicarla.
 */
import { useLanguage } from '../../../i18n/LanguageContext'
import { ES } from './landingNarrative.es'
import { EN } from './landingNarrative.en'

export const CONTACT = {
  email: 'mailto:c.hernandez@easy-logistics.co',
  phone: 'tel:+573208976999',
  phoneDisplay: '(+57) 320 8976999',
  address: 'Avenida calle 26 # 69 - 76 TORRE 3 OF 1501',
  whatsapp:
    'https://wa.me/573208976999?text=Hola%20Easy%20Logistics%2C%20quiero%20hablar%20con%20ustedes%20sobre%20una%20operaci%C3%B3n.',
}

export const QUOTE_PATH = '/app/cotizacion'

/** Anclas estables: no cambian con el idioma para no romper enlaces. */
export const SECTION_IDS = {
  hero: 'inicio',
  flow: 'como',
  method: 'easy',
  stories: 'casos',
  trust: 'confianza',
  contact: 'contacto',
}

/** Imágenes de los paneles de método, por id de slide. */
export const METHOD_MEDIA = {
  oficio: {
    img: '/media/method-team-oficio.webp',
    imgFallback: '/media/method-team-oficio.png',
  },
  sistema: {
    img: '/media/method-logistics-sistema.webp',
    imgFallback: '/media/method-logistics-sistema.png',
  },
  resultado: {
    img: '/media/method-logistics-resultado.webp',
    imgFallback: '/media/method-logistics-resultado.png',
  },
  criterio: {
    img: '/media/method-team-criterio.webp',
    imgFallback: '/media/method-team-criterio.png',
  },
}

/** Media de cobertura, por key de modo. */
export const MODE_MEDIA = {
  sea: { media: '/media/mode-sea.jpg', video: '/media/ship-orbit.mp4' },
  air: { media: '/media/mode-air.jpg' },
  road: { media: '/media/mode-road.jpg' },
}

export const DECKS = { es: ES, en: EN }

/** Copy de la landing en el idioma activo. */
export function useLandingCopy() {
  const { lang } = useLanguage()
  return DECKS[lang] ?? DECKS.es
}
