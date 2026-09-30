import { useState, useEffect } from 'react'
import { useAgendaApi } from '../../hooks/useAgendaApi'
import FormSheet from './FormSheet'
import { Campo } from './ui'
import { INPUT } from './estilos'

const EmpleadaFormModal = ({ empleada, onClose, onSaved, onDelete }) => {
  const { request } = useAgendaApi()
  const esEdicion = Boolean(empleada)

  const [form, setForm] = useState({
    idUsuario: empleada?.idUsuario || '',
    nombre: empleada?.nombre || '',
    activo: empleada?.activo !== undefined ? empleada.activo : true,
  })
  const [usuarios, setUsuarios] = useState([])
  const [cargandoUsuarios, setCargandoUsuarios] = useState(true)
  const [error, setError] = useState('')
  const [guardando, setGuardando] = useState(false)

  useEffect(() => {
    request('/Usuarios')
      .then((res) => (res.ok ? res.json() : Promise.reject(new Error('No se pudieron cargar los usuarios'))))
      .then(setUsuarios)
      .catch((err) => setError(err.message))
      .finally(() => setCargandoUsuarios(false))
  }, [request])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setGuardando(true)
    setError('')

    const body = { ...form, idUsuario: form.idUsuario ? Number(form.idUsuario) : null }

    try {
      const res = await request(esEdicion ? `/Empleadas/id/${empleada.id}` : '/Empleadas', {
        method: esEdicion ? 'PUT' : 'POST',
        body: JSON.stringify(body),
      })
      if (!res.ok) {
        const errData = await res.json().catch(() => null)
        throw new Error(errData?.message || 'No se pudo guardar la empleada')
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
      title={esEdicion ? 'Editar empleada' : 'Nueva empleada'}
      onClose={onClose}
      onSubmit={handleSubmit}
      guardando={guardando}
      error={error}
      onDelete={esEdicion ? onDelete : undefined}
      deleteLabel="Eliminar empleada"
    >
      <Campo label="Usuario asociado">
        {cargandoUsuarios ? (
          <p className="text-sm text-secondary">Cargando usuarios...</p>
        ) : usuarios.length === 0 ? (
          <p className="text-sm text-secondary">No hay usuarios disponibles.</p>
        ) : (
          <select name="idUsuario" value={form.idUsuario} onChange={handleChange} required className={INPUT}>
            <option value="">Seleccionar usuario...</option>
            {usuarios.map((u) => (
              <option key={u.id} value={u.id}>{u.username} ({u.rol})</option>
            ))}
          </select>
        )}
      </Campo>

      <Campo label="Nombre">
        <input name="nombre" value={form.nombre} onChange={handleChange} required className={INPUT} />
      </Campo>

      <label className="flex h-11 cursor-pointer select-none items-center gap-3 text-base">
        <input type="checkbox" name="activo" checked={form.activo} onChange={handleChange} className="h-5 w-5 accent-primary" />
        Activa
      </label>
    </FormSheet>
  )
}

export default EmpleadaFormModal