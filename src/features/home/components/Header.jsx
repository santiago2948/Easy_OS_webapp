import { Link, useLocation, useNavigate } from 'react-router-dom'
import BrandLogo from './BrandLogo'
import LanguageSwitch from './LanguageSwitch'
import { QUOTE_PATH, SECTION_IDS, useLandingCopy } from '../content/landingNarrative'
import { stripLangPrefix, useLangPath } from '../../../i18n/LanguageContext'
import { scrollToHomeTop } from '../utils/scrollToHomeTop'

export default function Header() {
  const copy = useLandingCopy()
  const langPath = useLangPath()
  const location = useLocation()
  const navigate = useNavigate()
  const homePath = langPath('/')
  const isHome = stripLangPrefix(location.pathname) === '/'

  const handleLogoClick = (event) => {
    if (!isHome) return
    event.preventDefault()
    scrollToHomeTop()
  }

  const handleNavClick = (event, item) => {
    if (!item.homeTop) return

    event.preventDefault()

    if (!isHome) {
      navigate(homePath)
      return
    }

    scrollToHomeTop()
    window.history.replaceState(null, '', homePath)
  }

  return (
    <header className="site-header">
      <Link
        to={homePath}
        className="site-logo"
        aria-label={copy.ui.homeAria}
        onClick={handleLogoClick}
      >
        <BrandLogo variant="onDark" size="sm" />
      </Link>

      <nav className="site-nav" aria-label={copy.ui.navAria}>
        {copy.nav.map((item) => {
          const anchor = {
            href: `${homePath}#${item.key}`,
            homeTop: item.key === SECTION_IDS.hero,
          }
          return (
            <a
              key={item.key}
              href={anchor.href}
              onClick={(event) => handleNavClick(event, anchor)}
            >
              {item.label}
            </a>
          )
        })}
      </nav>

      <div className="site-header__actions">
        <LanguageSwitch label={copy.ui.langAria} />

        <Link to={langPath(QUOTE_PATH)} className="btn-cotizar">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <rect x="5" y="3" width="14" height="18" rx="2" stroke="currentColor" strokeWidth="2" />
            <path
              d="M8 7h8M8 11h3M13 11h3M8 15h3M13 15h3"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
          </svg>
          {copy.ui.quoteShort}
        </Link>
      </div>
    </header>
  )
}
