import { Link } from 'react-router-dom'
import BrandLogo from './BrandLogo'
import { QUOTE_PATH } from '../content/landingNarrative'

const NAV = [
  { href: '/#inicio', label: 'Inicio' },
  { href: '/#como', label: 'Cómo' },
  { href: '/#easy', label: 'Easy' },
  { href: '/#contacto', label: 'Contacto' },
]

export default function Header() {
  return (
    <header className="site-header">
      <Link to="/" className="site-logo" aria-label="Easy Logistics inicio">
        <BrandLogo variant="onDark" size="sm" />
      </Link>

      <nav className="site-nav" aria-label="Principal">
        {NAV.map((item) => (
          <a key={item.href} href={item.href}>
            {item.label}
          </a>
        ))}
      </nav>

      <Link to={QUOTE_PATH} className="btn-cotizar">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <rect x="5" y="3" width="14" height="18" rx="2" stroke="currentColor" strokeWidth="2" />
          <path
            d="M8 7h8M8 11h3M13 11h3M8 15h3M13 15h3"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
        </svg>
        Cotizar
      </Link>
    </header>
  )
}
