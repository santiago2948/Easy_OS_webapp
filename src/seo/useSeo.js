import { useEffect } from 'react'
import { EN_PREFIX } from '../i18n/LanguageContext'

export const SITE_URL = 'https://easy-logistics.co'
export const SITE_NAME = 'Easy Logistics'
/** Tarjeta social. Reemplazar por un 1200×630 de marca cuando exista. */
export const OG_IMAGE = `${SITE_URL}/media/mode-sea.jpg`

const LOCALES = { es: 'es_CO', en: 'en_US' }

function absolute(path) {
  return path === '/' ? `${SITE_URL}/` : `${SITE_URL}${path}`
}

/** Crea o actualiza una etiqueta del head, marcándola como gestionada. */
function setTag(selector, create, attrs) {
  let el = document.head.querySelector(selector)
  if (!el) {
    el = create()
    el.dataset.seo = 'managed'
    document.head.appendChild(el)
  }
  Object.entries(attrs).forEach(([key, value]) => el.setAttribute(key, value))
  return el
}

function setMeta(name, content, attr = 'name') {
  if (!content) return
  setTag(`meta[${attr}="${name}"]`, () => document.createElement('meta'), {
    [attr]: name,
    content,
  })
}

function setLink(rel, href, extra = {}) {
  const hreflang = extra.hreflang
  const selector = hreflang
    ? `link[rel="${rel}"][hreflang="${hreflang}"]`
    : `link[rel="${rel}"]:not([hreflang])`
  setTag(selector, () => document.createElement('link'), { rel, href, ...extra })
}

/**
 * Metadatos por ruta: título, descripción, canónica, hreflang, Open Graph
 * y datos estructurados.
 *
 * `canonicalPath` es siempre la ruta en español (sin prefijo). La versión
 * inglesa se deriva añadiendo /en, de modo que ambas se declaran como
 * alternativas la una de la otra.
 */
export function useSeo({
  lang = 'es',
  title,
  description,
  canonicalPath = '/',
  localized = true,
  noindex = false,
  schema = null,
}) {
  useEffect(() => {
    const esUrl = absolute(canonicalPath)
    const enUrl = absolute(
      canonicalPath === '/' ? EN_PREFIX : `${EN_PREFIX}${canonicalPath}`,
    )
    const selfUrl = localized && lang === 'en' ? enUrl : esUrl

    document.title = title
    setMeta('description', description)
    setLink('canonical', selfUrl)

    if (localized) {
      setLink('alternate', esUrl, { hreflang: 'es' })
      setLink('alternate', enUrl, { hreflang: 'en' })
      setLink('alternate', esUrl, { hreflang: 'x-default' })
    } else {
      // Una ruta sin traducir no debe heredar los hreflang de la anterior.
      document.head
        .querySelectorAll('link[rel="alternate"][hreflang]')
        .forEach((el) => el.remove())
    }

    setMeta('robots', noindex ? 'noindex, follow' : 'index, follow')

    setMeta('og:title', title, 'property')
    setMeta('og:description', description, 'property')
    setMeta('og:url', selfUrl, 'property')
    setMeta('og:type', 'website', 'property')
    setMeta('og:site_name', SITE_NAME, 'property')
    setMeta('og:locale', LOCALES[lang] ?? LOCALES.es, 'property')
    setMeta('og:image', OG_IMAGE, 'property')

    setMeta('twitter:card', 'summary_large_image')
    setMeta('twitter:title', title)
    setMeta('twitter:description', description)
    setMeta('twitter:image', OG_IMAGE)

    let schemaEl
    if (schema) {
      schemaEl = document.createElement('script')
      schemaEl.type = 'application/ld+json'
      schemaEl.dataset.seo = 'route-schema'
      schemaEl.textContent = JSON.stringify(schema)
      document.head.appendChild(schemaEl)
    }

    return () => {
      schemaEl?.remove()
    }
  }, [lang, title, description, canonicalPath, localized, noindex, schema])
}
