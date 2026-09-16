import { createContext, useContext, useState, useEffect } from 'react'
import { apiFetch } from '../lib/api'

const AgendaAuthContext = createContext(null)
const STORAGE_KEY = 'agenda_credentials'

export const AgendaAuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [credentials, setCredentials] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const saved = sessionStorage.getItem(STORAGE_KEY)
    if (saved) {
      verificarSesion(saved).finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [])

  const verificarSesion = async (creds) => {
    try {
      const res = await apiFetch('/Usuarios/me', { credentials: creds })
      if (!res.ok) throw new Error('Credenciales inválidas')
      const data = await res.json()
      setUser(data)
      setCredentials(creds)
      return true
    } catch {
      sessionStorage.removeItem(STORAGE_KEY)
      setUser(null)
      setCredentials(null)
      return false
    }
  }

  const login = async (username, password) => {
    const creds = btoa(`${username}:${password}`)
    const ok = await verificarSesion(creds)
    if (ok) sessionStorage.setItem(STORAGE_KEY, creds)
    return ok
  }

  const logout = () => {
    sessionStorage.removeItem(STORAGE_KEY)
    setUser(null)
    setCredentials(null)
  }

  return (
    <AgendaAuthContext.Provider value={{ user, credentials, login, logout, loading }}>
      {children}
    </AgendaAuthContext.Provider>
  )
}

export const useAgendaAuth = () => useContext(AgendaAuthContext)