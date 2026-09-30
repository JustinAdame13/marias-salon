import { useState, useEffect, useCallback } from 'react'
import { useAgendaApi } from '../../hooks/useAgendaApi'
import { useAgendaAuth } from '../../context/AgendaAuthContext'
import ConfirmDialog from '../../components/agenda/ConfirmDialog'
import FormSheet from '../../components/agenda/FormSheet'
import { Avatar, Aviso, Campo, Chip, ErrorBanner, Fab, Titulo } from '../../components/agenda/ui'
import { CARD, INPUT } from '../../components/agenda/estilos'

const ROLES_USUARIO = [
  { value: 'ADMIN', label: 'Administrador' },
  { value: 'JEFA', label: 'Jefa' },
  { value: 'EMPLEADA', label: 'Empleada' },
]

const UsuarioFormModal = ({ usuario, onClose, onSaved, onDelete }) => {
  const { request } = useAgendaApi()
  const esEdicion = Boolean(usuario)

  const [form, setForm] = useState({
    username: usuario?.username || '',
    password: '',
    rol: usuario?.rol || 'EMPLEADA',
    activo: usuario?.activo ?? true,
  })
  const [error, setError] = useState('')
  const [guardando, setGuardando] = useState(false)

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setGuardando(true)
    setError('')
    try {
      const res = await request(esEdicion ? `/Usuarios/id/${usuario.id}` : '/Usuarios', {
        method: esEdicion ? 'PUT' : 'POST',
        body: JSON.stringify(form),
      })
      if (!res.ok) {
        const errData = await res.json().catch(() => null)
        throw new Error(errData?.message || 'No se pudo guardar el usuario')
      }
      onSaved()
    } catch (err) {
      setError(err.message)
    } finally {
      setGuardando(false)
    }
  }

  return (
    <FormSheet
      title={esEdicion ? 'Editar usuario' : 'Nuevo usuario'}
      onClose={onClose}
      onSubmit={handleSubmit}
      guardando={guardando}
      error={error}
      onDelete={esEdicion ? onDelete : undefined}
      deleteLabel="Eliminar usuario"
    >
      <Campo label="Usuario">
        <input name="username" value={form.username} onChange={handleChange} required autoComplete="off" className={INPUT} />
      </Campo>

      <Campo label={esEdicion ? 'Contraseña (vacío para mantener)' : 'Contraseña'}>
        <input
          type="password"
          name="password"
          value={form.password}
          onChange={handleChange}
          required={!esEdicion}
          autoComplete="new-password"
          className={INPUT}
        />
      </Campo>

      <Campo label="Rol">
        <select name="rol" value={form.rol} onChange={handleChange} className={INPUT}>
          {ROLES_USUARIO.map((r) => (
            <option key={r.value} value={r.value}>{r.label}</option>
          ))}
        </select>
      </Campo>

      <label className="flex h-11 cursor-pointer select-none items-center gap-3 text-base">
        <input type="checkbox" name="activo" checked={form.activo} onChange={handleChange} className="h-5 w-5 accent-primary" />
        Activo
      </label>
    </FormSheet>
  )
}

const Usuarios = () => {
  const { request } = useAgendaApi()
  const { user } = useAgendaAuth()
  const puedeModificar = user?.rol === 'ADMIN'

  const [usuarios, setUsuarios] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [usuarioEditando, setUsuarioEditando] = useState(null)
  const [usuarioAEliminar, setUsuarioAEliminar] = useState(null)

  const cargar = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const res = await request('/Usuarios')
      if (!res.ok) throw new Error('No se pudieron cargar los usuarios')
      setUsuarios(await res.json())
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [request])

  useEffect(() => {
    cargar()
  }, [cargar])

  const abrirCrear = () => {
    setUsuarioEditando(null)
    setModalOpen(true)
  }

  const abrirEditar = (u) => {
    if (!puedeModificar) return
    setUsuarioEditando(u)
    setModalOpen(true)
  }

  const pedirEliminar = () => {
    setModalOpen(false)
    setUsuarioAEliminar(usuarioEditando)
  }

  const confirmarEliminar = async () => {
    try {
      const res = await request(`/Usuarios/id/${usuarioAEliminar.id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('No se pudo eliminar el usuario')
      setUsuarioAEliminar(null)
      cargar()
    } catch (err) {
      setError(err.message)
      setUsuarioAEliminar(null)
    }
  }

  const rolLabel = (rol) => ROLES_USUARIO.find((r) => r.value === rol)?.label ?? rol

  return (
    <div>
      <Titulo>Usuarios</Titulo>
      {error && <ErrorBanner>{error}</ErrorBanner>}

      {loading ? (
        <Aviso>Cargando...</Aviso>
      ) : usuarios.length === 0 ? (
        <Aviso>No hay usuarios registrados</Aviso>
      ) : (
        <div className="grid gap-3 md:grid-cols-2">
          {usuarios.map((u) => (
            <div
              key={u.id}
              role={puedeModificar ? 'button' : undefined}
              tabIndex={puedeModificar ? 0 : undefined}
              onClick={() => abrirEditar(u)}
              onKeyDown={(e) => e.key === 'Enter' && abrirEditar(u)}
              className={`${CARD} flex items-center gap-3 ${puedeModificar ? 'cursor-pointer' : ''}`}
            >
              <Avatar nombre={u.username} />
              <div className="min-w-0 flex-1">
                <p className="truncate font-semibold">{u.username}</p>
                <p className="text-sm text-secondary">{rolLabel(u.rol)}</p>
              </div>
              <Chip tono={u.activo ? 'sage' : 'sand'}>{u.activo ? 'Activo' : 'Inactivo'}</Chip>
            </div>
          ))}
        </div>
      )}

      {puedeModificar && <Fab onClick={abrirCrear}>Nuevo usuario</Fab>}

      {modalOpen && (
        <UsuarioFormModal
          usuario={usuarioEditando}
          onClose={() => setModalOpen(false)}
          onSaved={() => {
            setModalOpen(false)
            cargar()
          }}
          onDelete={pedirEliminar}
        />
      )}

      {usuarioAEliminar && (
        <ConfirmDialog
          title="¿Eliminar usuario?"
          message={`Esto eliminará a "${usuarioAEliminar.username}" permanentemente.`}
          onConfirm={confirmarEliminar}
          onCancel={() => setUsuarioAEliminar(null)}
        />
      )}
    </div>
  )
}

export default Usuarios