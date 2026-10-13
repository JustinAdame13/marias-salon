import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { fadeUp } from '../../animations/variants'
import { useAgendaAuth } from '../../context/AgendaAuthContext'
import { despertarServidor } from '../../lib/api'
import { INPUT, BOTON_PRIMARIO } from '../../components/agenda/estilos'

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
    <div className="agenda-theme flex min-h-screen w-full items-center justify-center p-4">
      <div aria-hidden className="agenda-ambient" />
      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        className="w-full max-w-[24rem]"
      >
        <form
          onSubmit={handleSubmit}
          className="glass glass-strong flex w-full flex-col gap-4 rounded-[2rem] p-6 sm:p-8"
        >
          {despertando && (
            <p className="flex items-center justify-center gap-2 rounded-full bg-white/60 px-3 py-2 text-center text-xs text-secondary">
              <span className="size-1.5 animate-pulse rounded-full bg-gold" />
              Despertando el servidor, puede tardar unos segundos…
            </p>
          )}

          <div className="mb-2 text-center">
            <img src="/logo-marias.png" alt="Maria's Beauty Salon" width="640" height="206" className="mx-auto h-14 w-auto" />
            <div className="mx-auto mt-4 flex max-w-[12rem] items-center gap-2">
              <div className="h-px flex-1 gold-rule" />
              <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-gold-ink">Agenda</p>
              <div className="h-px flex-1 gold-rule" />
            </div>
            <h1 className="mt-4 font-['Bodoni_Moda'] text-3xl text-on-background">
              Bienvenida <span className="italic text-primary">de nuevo.</span>
            </h1>
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
            className={`${BOTON_PRIMARIO} mt-1 cursor-pointer`}
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
      </motion.div>
    </div>
  )
}

export default AgendaLogin