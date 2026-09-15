const API_BASE = (import.meta.env.VITE_API_URL ?? '').replace(/\/$/, '')

export async function fetchQuoteRoutes({ operationType, transportMode, containerType }) {
  const params = new URLSearchParams({
    operationType,
    transportMode,
  })

  if (transportMode === 'fcl' && containerType) {
    params.set('containerType', containerType)
  }

  const response = await fetch(`${API_BASE}/api/v1/quotes/routes?${params.toString()}`)

  let payload = {}
  try {
    payload = await response.json()
  } catch {
    payload = {}
  }

  if (!response.ok) {
    // Igual que en createQuote: el respaldo traducido lo pone el componente.
    const error = new Error(payload.message || '')
    error.status = response.status
    error.details = payload.details
    throw error
  }

  return payload.data
}
