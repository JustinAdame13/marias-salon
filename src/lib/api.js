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