import { useEffect, useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import AppHeader from '../components/AppHeader'
import AppSidebar from '../components/AppSidebar'
import { getActiveModuleId } from '../content/navigation'
import '../styles/app-shell.css'

export default function AppLayout() {
  const { pathname } = useLocation()
  const activeId = getActiveModuleId(pathname)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    setMenuOpen(false)
  }, [pathname])

  useEffect(() => {
    if (!menuOpen) return undefined

    const onKeyDown = (event) => {
      if (event.key === 'Escape') setMenuOpen(false)
    }

    document.addEventListener('keydown', onKeyDown)
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = ''
    }
  }, [menuOpen])

  return (
    <div className={`app-shell${menuOpen ? ' app-shell--menu-open' : ''}`}>
      <AppSidebar activeId={activeId} isOpen={menuOpen} onClose={() => setMenuOpen(false)} />

      <div className="app-shell__main">
        <AppHeader menuOpen={menuOpen} onMenuToggle={() => setMenuOpen((open) => !open)} />
        <main className="app-shell__content">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
