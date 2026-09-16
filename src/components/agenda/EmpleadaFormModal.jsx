import { useState, useEffect } from 'react'
import { useAgendaApi } from '../../hooks/useAgendaApi'

const EmpleadaFormModal = ({ empleada, onClose, onSaved }) => {
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
      .then((res) => res.ok ? res.json() : Promise.reject(new Error('No se pudieron cargar los usuarios')))
      .then(setUsuarios)
      .catch((err) => setError(err.message))
      .finally(() => setCargandoUsuarios(false))
  }, [request])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setGuardando(true)
    setError('')

    const body = {
      ...form,
      idUsuario: form.idUsuario ? Number(form.idUsuario) : null,
    }

    try {
      const path = esEdicion ? `/Empleadas/id/${empleada.id}` : '/Empleadas'
      const res = await request(path, {
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 overflow-y-auto">
      <form
        onSubmit={handleSubmit}
        style={{ width: '90vw', maxWidth: '480px', minWidth: '300px' }}
        className="bg-surface-container-lowest rounded-lg shadow-2xl p-6 flex flex-col gap-4 max-h-[90vh] overflow-y-auto my-auto shrink-0 box-border"
      >
        <h2 className="font-headline-md text-xl font-bold text-primary">
          {esEdicion ? 'Editar empleada' : 'Nueva empleada'}
        </h2>

        <label className="flex flex-col gap-1 text-sm font-medium">
          Usuario asociado
          {cargandoUsuarios ? (
            <p className="text-sm text-secondary">Cargando usuarios...</p>
          ) : usuarios.length === 0 ? (
            <p className="text-sm text-secondary">No hay usuarios disponibles.</p>
          ) : (
            <select
              name="idUsuario"
              value={form.idUsuario}
              onChange={handleChange}
              required
              className="border border-outline-variant rounded-sm p-2 w-full text-base sm:text-sm focus:outline-none focus:ring-1 focus:ring-primary bg-surface-container-lowest"
            >
              <option value="">Seleccionar usuario...</option>
              {usuarios.map((u) => (
                <option key={u.id} value={u.id}>{u.username} ({u.rol})</option>
              ))}
            </select>
          )}
        </label>

        <label className="flex flex-col gap-1 text-sm font-medium">
          Nombre
          <input
            name="nombre"
            value={form.nombre}
            onChange={handleChange}
            required
            className="border border-outline-variant rounded-sm p-2 w-full text-base sm:text-sm focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </label>

        <label className="flex items-center gap-2 text-sm font-medium">
          <input
            type="checkbox"
            name="activo"
            checked={form.activo}
            onChange={handleChange}
            className="h-4 w-4"
          />
          Activa
        </label>

        {error && <p className="text-error text-sm font-medium">{error}</p>}

        <div className="flex justify-end gap-3 mt-2 pt-2 border-t border-outline-variant/30">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm text-secondary hover:text-primary transition-colors cursor-pointer"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={guardando}
            className="bg-primary text-on-primary px-5 py-2 rounded-md text-sm font-semibold hover:opacity-90 disabled:opacity-50 transition-opacity cursor-pointer"
          >
            {guardando ? 'Guardando...' : 'Guardar'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default EmpleadaFormModal