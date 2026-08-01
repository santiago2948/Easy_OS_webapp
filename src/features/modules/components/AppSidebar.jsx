import { Link, NavLink } from 'react-router-dom'
import BrandLogo from '../../home/components/BrandLogo'
import { MODULE_NAV } from '../content/navigation'
import NavIcon from './NavIcon'

export default function AppSidebar({ activeId, isOpen = false, onClose }) {
  return (
    <>
      <button
        type="button"
        className={`app-sidebar__backdrop${isOpen ? ' is-visible' : ''}`}
        aria-label="Cerrar menú"
        onClick={onClose}
        tabIndex={isOpen ? 0 : -1}
      />

      <aside id="app-sidebar" className={`app-sidebar${isOpen ? ' is-open' : ''}`}>
        <div className="app-sidebar__top">
          <Link to="/app/cotizacion" className="app-sidebar__brand" aria-label="Easy Logistics">
            <BrandLogo variant="onDark" size="sm" />
          </Link>

          <nav className="app-sidebar__nav" aria-label="Módulos">
            <ul>
              {MODULE_NAV.map((item) => {
                const baseClass = `app-sidebar__link${item.soon ? ' is-soon' : ''}`

                if (item.soon) {
                  return (
                    <li key={item.id}>
                      <span className={baseClass} aria-disabled="true" title="Próximamente">
                        <NavIcon name={item.icon} />
                        {item.label}
                      </span>
                    </li>
                  )
                }

                return (
                  <li key={item.id}>
                    <NavLink
                      to={item.path}
                      className={({ isActive }) =>
                        `${baseClass}${isActive || item.id === activeId ? ' is-active' : ''}`
                      }
                      end
                      onClick={onClose}
                    >
                      <NavIcon name={item.icon} />
                      {item.label}
                    </NavLink>
                  </li>
                )
              })}
            </ul>
          </nav>
        </div>

        <div className="app-sidebar__footer">
          <Link to="/" className="app-sidebar__logout" onClick={onClose}>
            <NavIcon name="logout" />
            Cerrar Sesión
          </Link>

          <div className="app-sidebar__legal">
            <Link to="/legal/tratamiento-de-datos" onClick={onClose}>
              Tratamiento de datos
            </Link>
            <span aria-hidden="true">|</span>
            <Link to="/legal/cookies" onClick={onClose}>
              Cookies
            </Link>
          </div>
        </div>
      </aside>
    </>
  )
}
