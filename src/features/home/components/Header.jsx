import { Link, useLocation, useNavigate } from 'react-router-dom'
import BrandLogo from './BrandLogo'
import { QUOTE_PATH } from '../content/landingNarrative'
import { scrollToHomeTop } from '../utils/scrollToHomeTop'

const NAV = [
  { href: '/#inicio', label: 'Inicio', homeTop: true },
  { href: '/#como', label: 'Cómo' },
  { href: '/#easy', label: 'Easy' },
  { href: '/#contacto', label: 'Contacto' },
]

export default function Header() {
  const location = useLocation()
  const navigate = useNavigate()
  const isHome = location.pathname === '/'

  const handleLogoClick = (event) => {
    if (!isHome) return
    event.preventDefault()
    scrollToHomeTop()
  }

  const handleNavClick = (event, item) => {
    if (!item.homeTop) return

    event.preventDefault()

    if (!isHome) {
      navigate('/')
      return
    }

    scrollToHomeTop()
    window.history.replaceState(null, '', '/')
  }

  return (
    <header className="site-header">
      <Link
        to="/"
        className="site-logo"
        aria-label="Easy Logistics inicio"
        onClick={handleLogoClick}
      >
        <BrandLogo variant="onDark" size="sm" />
      </Link>

      <nav className="site-nav" aria-label="Principal">
        {NAV.map((item) => (
          <a key={item.href} href={item.href} onClick={(event) => handleNavClick(event, item)}>
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
