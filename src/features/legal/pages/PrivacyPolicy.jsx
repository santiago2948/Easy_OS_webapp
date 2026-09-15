import LegalDocument from '../components/LegalDocument'
import { PRIVACY_POLICY } from '../content/privacyPolicy'
import { useSeo } from '../../../seo/useSeo'

export default function PrivacyPolicy() {
  useSeo({
    lang: 'es',
    title: 'Política de tratamiento de datos | Easy Logistics',
    description:
      'Cómo Easy Logistics recolecta, usa y protege los datos personales, conforme a la Ley 1581 de 2012 y el Decreto 1377 de 2013 de Colombia.',
    canonicalPath: '/legal/tratamiento-de-datos',
    localized: false,
  })

  return <LegalDocument document={PRIVACY_POLICY} />
}
