import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { fadeUp } from '../../animations/variants'
import { useAgendaAuth } from '../../context/AgendaAuthContext'

const AgendaLogin = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAgendaAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    const ok = await login(username, password)
    setLoading(false)
    if (ok) {
      navigate('/agenda')
    } else {
      setError('Usuario o contraseña incorrectos')
    }
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background p-4 box-border">
      <motion.form
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        onSubmit={handleSubmit}
        style={{ width: '90vw', maxWidth: '420px', minWidth: '280px' }}
        className="bg-surface-container-lowest rounded-lg shadow-xl p-8 flex flex-col gap-4 my-auto shrink-0"
      >
        <h1 className="font-headline-md text-2xl text-primary text-center mb-2">
          Maria's Beauty Salon
        </h1>
        <p className="text-sm text-secondary text-center mb-2">
          Acceso al panel de citas
        </p>

        <input
          type="text"
          placeholder="Usuario"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="border border-outline-variant rounded-sm px-md py-sm"
          required
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border border-outline-variant rounded-sm px-md py-sm"
          required
        />

        {error && <p className="text-error text-sm text-center">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="bg-primary text-on-primary py-sm rounded-sm font-label-md hover:opacity-90 disabled:opacity-50"
        >
          {loading ? 'Entrando...' : 'Entrar'}
        </button>
      </motion.form>
    </div>
  )
}

export default AgendaLogin