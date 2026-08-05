import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { scrollToHomeTop } from '../features/home/utils/scrollToHomeTop'

export default function ScrollToTop() {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    if (pathname === '/') {
      if (hash === '#inicio' || hash === '') {
        scrollToHomeTop()
        if (hash === '#inicio') {
          window.history.replaceState(null, '', '/')
        }
      }
      return
    }

    window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
  }, [pathname, hash])

  return null
}
