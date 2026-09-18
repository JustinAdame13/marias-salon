const API_URL = import.meta.env.VITE_API_URL

export function apiFetch(path, { credentials, ...options } = {}) {
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  }

  if (credentials) {
    headers['Authorization'] = `Basic ${credentials}`
  }

  return fetch(`${API_URL}${path}`, { ...options, headers })
}
export async function despertarServidor(intentos = 10, esperaMs = 4000) {
  for (let i = 0; i < intentos; i++) {
    try {
      const res = await fetch(`${API_URL}/internal/ping`)
      if (res.ok) return true
    } catch {
      // aún dormido o red no lista, seguimos intentando
    }
    await new Promise((r) => setTimeout(r, esperaMs))
  }
  return false
}