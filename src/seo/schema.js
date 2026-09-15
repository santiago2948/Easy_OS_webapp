import { SITE_NAME, SITE_URL } from './useSeo'

const ORG_ID = `${SITE_URL}/#organization`
const SITE_ID = `${SITE_URL}/#website`

/**
 * Grafo de datos estructurados de la home.
 *
 * Es el canal que mejor leen los motores generativos: no requiere ejecutar
 * JavaScript ni interpretar el diseño. Solo debe afirmar cosas verificables
 * en la propia página.
 */
export function buildHomeSchema({ copy, lang, contact, pageUrl }) {
  const inLanguage = lang === 'en' ? 'en' : 'es-CO'

  const organization = {
    '@type': 'Organization',
    '@id': ORG_ID,
    name: SITE_NAME,
    legalName: 'Easy Logistics Colombia S.A.S',
    url: SITE_URL,
    logo: `${SITE_URL}/brand/easy-logo-on-light.svg`,
    email: contact.email.replace('mailto:', ''),
    telephone: '+57-320-897-6999',
    address: {
      '@type': 'PostalAddress',
      streetAddress: contact.address,
      addressLocality: 'Bogotá',
      addressCountry: 'CO',
    },
    areaServed: { '@type': 'Country', name: 'Colombia' },
    description: copy.geo.what,
  }

  const website = {
    '@type': 'WebSite',
    '@id': SITE_ID,
    url: SITE_URL,
    name: SITE_NAME,
    inLanguage,
    publisher: { '@id': ORG_ID },
  }

  const service = {
    '@type': 'Service',
    name: lang === 'en' ? 'International freight brokerage' : 'Intermediación de carga internacional',
    serviceType: lang === 'en' ? 'Freight forwarding' : 'Agenciamiento de carga',
    provider: { '@id': ORG_ID },
    areaServed: { '@type': 'Country', name: 'Colombia' },
    description: copy.geo.services,
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: copy.trust.coverage.t,
      itemListElement: copy.trust.coverage.modes.map((mode) => ({
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: mode.mode,
          description: mode.d,
        },
      })),
    },
  }

  const faq = {
    '@type': 'FAQPage',
    '@id': `${pageUrl}#faq`,
    inLanguage,
    mainEntity: copy.faq.items.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: { '@type': 'Answer', text: item.a },
    })),
  }

  return {
    '@context': 'https://schema.org',
    '@graph': [organization, website, service, faq],
  }
}
