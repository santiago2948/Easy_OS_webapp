import { DATA_POLICY_VERSION } from '../../legal/content/dataConsent'

const API_BASE = (import.meta.env.VITE_API_URL ?? '').replace(/\/$/, '')

export async function createLead({
  name,
  phoneNumber,
  captchaToken,
  acceptedDataPolicy,
  dataPolicyVersion = DATA_POLICY_VERSION,
}) {
  const response = await fetch(`${API_BASE}/api/v1/leads`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name,
      phoneNumber,
      captchaToken,
      acceptedDataPolicy,
      dataPolicyVersion,
    }),
  })

  let payload = {}
  try {
    payload = await response.json()
  } catch {
    payload = {}
  }

  if (!response.ok) {
    const error = new Error(payload.message || 'No se pudo enviar el formulario')
    error.status = response.status
    error.details = payload.details
    throw error
  }

  return payload
}
