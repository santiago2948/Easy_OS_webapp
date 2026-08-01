const API_BASE = (import.meta.env.VITE_API_URL ?? '').replace(/\/$/, '')

export async function createQuote(payload) {
  const response = await fetch(`${API_BASE}/api/v1/quotes`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })

  let data = {}
  try {
    data = await response.json()
  } catch {
    data = {}
  }

  if (!response.ok) {
    const error = new Error(data.message || 'No se pudo enviar la cotización')
    error.status = response.status
    error.details = data.details
    throw error
  }

  return data
}
