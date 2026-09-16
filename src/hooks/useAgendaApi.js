import { useCallback } from 'react'
import { useAgendaAuth } from '../context/AgendaAuthContext'
import { apiFetch } from '../lib/api'

export function useAgendaApi() {
  const { credentials, logout } = useAgendaAuth()

  const request = useCallback(async (path, options = {}) => {
    const res = await apiFetch(path, { ...options, credentials })
    if (res.status === 401) {
      logout()
      throw new Error('Tu sesión expiró, vuelve a iniciar sesión')
    }
    return res
  }, [credentials, logout])

  return { request }
}