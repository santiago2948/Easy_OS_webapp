import { useState } from 'react'
import QuotationForm from '../components/QuotationForm'
import QuotationLanding from '../components/QuotationLanding'
import { useLandingCopy, QUOTE_PATH } from '../../home/content/landingNarrative'
import { useLanguage } from '../../../i18n/LanguageContext'
import { useSeo } from '../../../seo/useSeo'
import '../styles/quotation.css'

export default function Quotation() {
  const { lang } = useLanguage()
  const copy = useLandingCopy()
  const [view, setView] = useState('landing')

  useSeo({
    lang,
    title: copy.seo.quote.title,
    description: copy.seo.quote.description,
    canonicalPath: QUOTE_PATH,
  })

  return (
    <section className={`quote-page${view === 'form' ? ' quote-page--form' : ''}`}>
      {view === 'landing' ? (
        <QuotationLanding onStartQuote={() => setView('form')} />
      ) : (
        <QuotationForm onBack={() => setView('landing')} />
      )}
    </section>
  )
}
