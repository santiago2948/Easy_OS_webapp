function MenuIcon({ open }) {
  if (open) {
    return (
      <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
        <path
          d="M6 6l12 12M18 6L6 18"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    )
  }

  return (
    <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
      <path
        d="M4 7h16M4 12h16M4 17h16"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  )
}

export default function AppHeader({ userName = 'Administrador', menuOpen = false, onMenuToggle }) {
  return (
    <header className="app-header">
      <button
        type="button"
        className="app-header__menu-btn"
        onClick={onMenuToggle}
        aria-expanded={menuOpen}
        aria-controls="app-sidebar"
        aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'}
      >
        <MenuIcon open={menuOpen} />
      </button>

      <div className="app-header__start">
        <p className="app-header__welcome">
          Bienvenido, <strong>{userName}</strong>
        </p>
        <button type="button" className="app-header__admin">
          <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
            <circle cx="12" cy="12" r="3" fill="none" stroke="currentColor" strokeWidth="1.8" />
            <path
              d="M12 2v2M12 20v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M2 12h2M20 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
          </svg>
          <span className="app-header__admin-text">Panel de Administración</span>
        </button>
      </div>

      <div className="app-header__actions">
        <button type="button" className="app-header__icon-btn" aria-label="Notificaciones">
          <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
            <path
              d="M6 18h12M6 18a5 5 0 0110 0M10 18a2 2 0 004 0"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
            <path
              d="M12 3a4 4 0 00-4 4v2.5c0 .8-.3 1.6-.8 2.2L6 13h12l-1.2-1.3c-.5-.6-.8-1.4-.8-2.2V7a4 4 0 00-4-4z"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinejoin="round"
            />
          </svg>
        </button>
        <button type="button" className="app-header__avatar" aria-label="Perfil de usuario">
          <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
            <circle cx="12" cy="8" r="4" fill="currentColor" opacity="0.9" />
            <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" fill="currentColor" opacity="0.9" />
          </svg>
        </button>
      </div>
    </header>
  )
}
