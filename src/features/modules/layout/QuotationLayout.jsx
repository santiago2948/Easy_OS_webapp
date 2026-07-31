import { useEffect } from 'react'
import Header from '../../home/components/Header'
import LoginBackdrop from '../../users/components/LoginBackdrop'
import Quotation from '../pages/Quotation'
import '../../home/styles/landing.css'
import '../../home/styles/orbit.css'
import '../styles/quotation-layout.css'

export default function QuotationLayout() {
  useEffect(() => {
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [])

  return (
    <div className="orbit-page quote-module-page">
      <LoginBackdrop />

      <Header />

      <main className="quote-module-main">
        <Quotation />
      </main>
    </div>
  )
}
