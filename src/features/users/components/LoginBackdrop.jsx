import { useEffect, useRef } from 'react'

const DOT = 'rgba(0, 229, 255, 0.88)'
const DOT_DIM = 'rgba(0, 229, 255, 0.28)'

function pointInRing(x, y, ring) {
  let inside = false
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i, i += 1) {
    const xi = ring[i][0]
    const yi = ring[i][1]
    const xj = ring[j][0]
    const yj = ring[j][1]
    const intersect =
      yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi + 0.0) + xi
    if (intersect) inside = !inside
  }
  return inside
}

function pointInPolygon(x, y, rings) {
  if (!rings.length) return false
  if (!pointInRing(x, y, rings[0])) return false
  for (let i = 1; i < rings.length; i += 1) {
    if (pointInRing(x, y, rings[i])) return false
  }
  return true
}

function collectPolygons(geometry) {
  if (geometry.type === 'Polygon') return [geometry.coordinates]
  if (geometry.type === 'MultiPolygon') return geometry.coordinates
  return []
}

/**
 * Mapa mundial de puntos (Natural Earth 110m).
 */
export default function LoginBackdrop() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return undefined

    let disposed = false
    let ro

    const draw = (geojson) => {
      if (disposed || !geojson?.features?.length) return

      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      const w = canvas.clientWidth
      const h = canvas.clientHeight
      if (!w || !h) return

      canvas.width = Math.floor(w * dpr)
      canvas.height = Math.floor(h * dpr)

      const ctx = canvas.getContext('2d')
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.clearRect(0, 0, w, h)

      const step = w < 768 ? 7 : 5
      const r = w < 768 ? 1.1 : 1.35
      const landPolys = []

      geojson.features.forEach((feature) => {
        collectPolygons(feature.geometry).forEach((poly) => {
          landPolys.push(poly)
        })
      })

      for (let py = step; py < h; py += step) {
        for (let px = step; px < w; px += step) {
          const lng = (px / w) * 360 - 180
          const lat = 90 - (py / h) * 180
          let onLand = false

          for (const poly of landPolys) {
            if (pointInPolygon(lng, lat, poly)) {
              onLand = true
              break
            }
          }

          ctx.beginPath()
          ctx.arc(px, py, r, 0, Math.PI * 2)
          ctx.fillStyle = onLand ? DOT : DOT_DIM
          ctx.fill()
        }
      }
    }

    fetch('/media/world-land-110m.json')
      .then((res) => (res.ok ? res.json() : null))
      .then((geojson) => {
        draw(geojson)
        ro = new ResizeObserver(() => draw(geojson))
        ro.observe(canvas)
      })
      .catch(() => {})

    return () => {
      disposed = true
      ro?.disconnect()
    }
  }, [])

  return (
    <div className="login-backdrop" aria-hidden="true">
      <canvas ref={canvasRef} className="login-backdrop__canvas" />
      <div className="login-backdrop__glow" />
      <div className="login-backdrop__veil" />
    </div>
  )
}
