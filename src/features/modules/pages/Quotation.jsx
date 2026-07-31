import { useState } from 'react'
import QuotationForm from '../components/QuotationForm'
import QuotationLanding from '../components/QuotationLanding'
import '../styles/quotation.css'

export default function Quotation() {
  const [view, setView] = useState('landing')

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
