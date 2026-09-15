import LegalDocument from '../components/LegalDocument'
import { COOKIES_POLICY } from '../content/cookiesPolicy'
import { useSeo } from '../../../seo/useSeo'

export default function CookiesPolicy() {
  useSeo({
    lang: 'es',
    title: 'Política de cookies | Easy Logistics',
    description:
      'Qué cookies utiliza el sitio de Easy Logistics, para qué se usan y cómo puede gestionarlas desde su navegador.',
    canonicalPath: '/legal/cookies',
    localized: false,
  })

  return <LegalDocument document={COOKIES_POLICY} />
}
