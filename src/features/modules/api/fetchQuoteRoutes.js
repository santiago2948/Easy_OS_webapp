const API_BASE = (import.meta.env.VITE_API_URL ?? '').replace(/\/$/, '')

export async function fetchQuoteRoutes({ operationType, transportMode }) {
  const params = new URLSearchParams({
    operationType,
    transportMode,
  })

  const response = await fetch(`${API_BASE}/api/v1/quotes/routes?${params.toString()}`)

  let payload = {}
  try {
    payload = await response.json()
  } catch {
    payload = {}
  }

  if (!response.ok) {
    const error = new Error(payload.message || 'No se pudieron cargar orígenes y destinos')
    error.status = response.status
    error.details = payload.details
    throw error
  }

  return payload.data
}
