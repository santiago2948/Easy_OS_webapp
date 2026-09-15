import { Link } from 'react-router-dom'
import {
  COOKIES_POLICY_PATH,
  DATA_POLICY_PATH,
} from '../../legal/content/dataConsent'
import BrandLogo from './BrandLogo'
import { CONTACT, SECTION_IDS, useLandingCopy } from '../content/landingNarrative'
import { scrollToHomeTop } from '../utils/scrollToHomeTop'

export default function Footer() {
  const copy = useLandingCopy()
  const { footer } = copy

  return (
    <footer className="site-footer">
      <div className="site-footer__main">
        <div className="site-footer__brand-col">
          <BrandLogo variant="onDark" size="sm" />
          <p>{footer.blurb}</p>
        </div>

        <div className="site-footer__col">
          <h3>{footer.linksTitle}</h3>
          <ul>
            {footer.links.map((item) => (
              <li key={item.key}>
                <a
                  href={`#${item.key}`}
                  onClick={
                    item.key === SECTION_IDS.hero
                      ? (event) => {
                          event.preventDefault()
                          scrollToHomeTop()
                          window.history.replaceState(null, '', '/')
                        }
                      : undefined
                  }
                >
                  <span className="site-footer__bullet" aria-hidden="true">
                    ▹
                  </span>
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="site-footer__col">
          <h3>{footer.servicesTitle}</h3>
          <ul>
            {footer.services.map((label) => (
              <li key={label}>
                <a href={`#${SECTION_IDS.trust}`}>{label}</a>
              </li>
            ))}
          </ul>
        </div>

        <div className="site-footer__col site-footer__contact">
          <h3>{footer.contactTitle}</h3>
          <ul>
            <li>
              <span className="site-footer__icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none">
                  <path
                    d="M12 21s7-5.2 7-11a7 7 0 10-14 0c0 5.8 7 11 7 11z"
                    stroke="currentColor"
                    strokeWidth="1.8"
                  />
                  <circle cx="12" cy="10" r="2.2" fill="currentColor" />
                </svg>
              </span>
              <span>{CONTACT.address}</span>
            </li>
            <li>
              <span className="site-footer__icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none">
                  <path
                    d="M6.5 4.5h3l1.5 4-2 1.5a12 12 0 005.5 5.5l1.5-2 4 1.5v3a2 2 0 01-2.2 2A15 15 0 014.5 6.7 2 2 0 016.5 4.5z"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
              <a href={CONTACT.phone}>{CONTACT.phoneDisplay}</a>
            </li>
            <li>
              <span className="site-footer__icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none">
                  <rect
                    x="3"
                    y="5"
                    width="18"
                    height="14"
                    rx="2"
                    stroke="currentColor"
                    strokeWidth="1.8"
                  />
                  <path
                    d="M4 7l8 6 8-6"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
              <a href="mailto:c.hernandez@easy-logistics.co">
                c.hernandez@easy-logistics.co
              </a>
            </li>
          </ul>

          <div className="site-footer__social">
            <a
              href={CONTACT.whatsapp}
              target="_blank"
              rel="noreferrer"
              aria-label="WhatsApp"
              className="site-footer__social-btn"
            >
              <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
                <path
                  fill="currentColor"
                  d="M12.04 2C6.58 2 2.15 6.4 2.15 11.84c0 1.97.52 3.88 1.5 5.57L2 22l4.76-1.55a9.9 9.9 0 004.28.96h.01c5.46 0 9.89-4.4 9.89-9.84C20.94 6.4 16.5 2 12.04 2zm5.76 14.05c-.24.68-1.4 1.25-1.93 1.33-.5.07-1.12.1-1.81-.11-.42-.13-.95-.31-1.64-.61-2.88-1.25-4.76-4.15-4.9-4.34-.14-.19-1.16-1.54-1.16-2.94s.73-2.08 1-2.24c.24-.15.53-.19.71-.19h.51c.16 0 .38-.06.59.45.22.53.74 1.83.8 1.96.07.13.11.29.02.46-.09.19-.14.3-.27.46-.13.15-.28.34-.4.46-.13.13-.27.27-.12.52.15.26.67 1.1 1.44 1.78 1 .88 1.83 1.16 2.1 1.29.26.13.42.11.57-.07.16-.19.66-.77.84-1.03.18-.26.36-.22.6-.13.24.09 1.53.72 1.79.85.26.13.43.19.5.3.06.11.06.64-.18 1.32z"
                />
              </svg>
            </a>
            <a
              href="https://www.linkedin.com/"
              target="_blank"
              rel="noreferrer"
              aria-label="LinkedIn"
              className="site-footer__social-btn"
            >
              <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
                <path
                  fill="currentColor"
                  d="M6.94 8.5H3.75V20h3.19V8.5zM5.34 7.15a1.85 1.85 0 110-3.7 1.85 1.85 0 010 3.7zM20.25 20h-3.18v-5.6c0-1.33-.02-3.05-1.86-3.05-1.86 0-2.15 1.45-2.15 2.95V20H9.88V8.5h3.05v1.57h.04c.43-.8 1.46-1.65 3-1.65 3.21 0 3.8 2.11 3.8 4.86V20z"
                />
              </svg>
            </a>
          </div>
        </div>
      </div>

      <div className="site-footer__legal">
        <div className="site-footer__policies">
          <Link to={DATA_POLICY_PATH}>{footer.dataPolicy}</Link>
          <span aria-hidden="true">|</span>
          <Link to={COOKIES_POLICY_PATH}>{footer.cookiesPolicy}</Link>
        </div>
        <p className="site-footer__copy">
          Copyright © {new Date().getFullYear()} Easy Logistics. {footer.rights}
        </p>
      </div>
    </footer>
  )
}
