import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { fadeUp } from '../../animations/variants'
import { useAgendaAuth } from '../../context/AgendaAuthContext'
import { despertarServidor } from '../../lib/api'
import { INPUT } from '../../components/agenda/estilos'

const AgendaLogin = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [despertando, setDespertando] = useState(true)

  const { login } = useAgendaAuth()
  const navigate = useNavigate()

  useEffect(() => {
    despertarServidor().finally(() => setDespertando(false))
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    const ok = await login(username, password)
    setLoading(false)
    if (ok) navigate('/agenda')
    else setError('Usuario o contraseña incorrectos')
  }

  return (
    <div className="agenda-theme flex min-h-screen w-full items-center justify-center bg-background p-4">
      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        className="w-full max-w-[24rem]"
      >
        <form
          onSubmit={handleSubmit}
          className="flex w-full flex-col gap-4 rounded-3xl border border-outline-variant bg-white p-6 sm:p-8 shadow-xl"
        >
          {despertando && (
            <p className="rounded-xl bg-surface-container-low px-3 py-2 text-center text-sm text-secondary">
              Despertando el servidor, esto puede tardar unos segundos...
            </p>
          )}

          <div className="text-center">
            <h1 className="font-headline-md text-3xl text-primary">Maria's</h1>
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-secondary">
              Agenda
            </p>
          </div>

          <input
            type="text"
            placeholder="Usuario"
            autoComplete="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className={INPUT}
            required
          />
          <input
            type="password"
            placeholder="Contraseña"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={INPUT}
            required
          />

          {error && <p className="text-center text-sm text-error">{error}</p>}

          <button
            type="submit"
            disabled={loading || despertando}
            className="h-12 rounded-xl bg-primary font-semibold text-on-primary active:bg-[#663a40] disabled:opacity-50 cursor-pointer"
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
      </motion.div>
    </div>
  )
}

export default AgendaLogin