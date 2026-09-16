import { useState, useEffect, useCallback } from 'react'
import { useAgendaApi } from '../../hooks/useAgendaApi'
import { useAgendaAuth } from '../../context/AgendaAuthContext'
import ConfirmDialog from '../../components/agenda/ConfirmDialog'

const ROLES_USUARIO = [
  { value: 'ADMIN', label: 'Administrador' },
  { value: 'JEFA', label: 'Jefa' },
  { value: 'EMPLEADA', label: 'Empleada' },
]

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

  const cargarUsuarios = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const res = await request('/Usuarios')
      if (!res.ok) throw new Error('No se pudieron cargar los usuarios')
      const data = await res.json()
      setUsuarios(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [request])

  useEffect(() => {
    cargarUsuarios()
  }, [cargarUsuarios])

  const abrirCrear = () => {
    setUsuarioEditando({
      username: '',
      password: '',
      rol: 'EMPLEADA',
      activo: true,
    })
    setModalOpen(true)
  }

  const abrirEditar = (usuario) => {
    setUsuarioEditando({
      username: usuario.username,
      password: '',
      rol: usuario.rol,
      activo: usuario.activo,
    })
    setModalOpen(true)
  }

  const handleGuardado = async (e) => {
    e.preventDefault()
    setError('')

    const body = {
      username: usuarioEditando.username,
      password: usuarioEditando.password,
      rol: usuarioEditando.rol,
      activo: usuarioEditando.activo,
    }

    try {
      const esEdicion = usuarioEditando.id
      const path = esEdicion ? `/Usuarios/id/${usuarioEditando.id}` : '/Usuarios'
      const method = esEdicion ? 'PUT' : 'POST'

      const res = await request(path, {
        method,
        body: JSON.stringify(body),
      })

      if (!res.ok) {
        const errData = await res.json().catch(() => null)
        throw new Error(errData?.message || 'No se pudo guardar el usuario')
      }

      setModalOpen(false)
      setUsuarioEditando(null)
      cargarUsuarios()
    } catch (err) {
      setError(err.message)
    }
  }

  const confirmarEliminar = async () => {
    try {
      const res = await request(`/Usuarios/id/${usuarioAEliminar.id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('No se pudo eliminar el usuario')
      setUsuarioAEliminar(null)
      cargarUsuarios()
    } catch (err) {
      setError(err.message)
      setUsuarioAEliminar(null)
    }
  }

  const getRolLabel = (rol) => {
    const rolInfo = ROLES_USUARIO.find(r => r.value === rol)
    return rolInfo ? rolInfo.label : rol
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-sm mb-lg">
        <h1 className="font-headline-md text-2xl text-primary">Usuarios</h1>
        {puedeModificar && (
          <button
            onClick={abrirCrear}
            className="bg-primary text-on-primary px-lg py-sm rounded-sm font-label-md hover:opacity-90 transition-opacity"
          >
            + Nuevo usuario
          </button>
        )}
      </div>

      {error && (
        <div className="bg-error-container text-on-error-container px-md py-sm rounded-sm mb-md text-sm">
          {error}
        </div>
      )}

      <div className="bg-surface-container-lowest rounded-lg border border-outline-variant/20 p-2 sm:p-4">
        {loading ? (
          <p className="text-secondary">Cargando...</p>
        ) : usuarios.length === 0 ? (
          <p className="text-secondary text-center py-8">No hay usuarios registrados</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-full">
              <thead>
                <tr className="border-b border-outline-variant/20">
                  <th className="text-left py-2 px-2 sm:px-3 text-xs sm:text-sm font-medium text-secondary">Usuario</th>
                  <th className="text-left py-2 px-2 sm:px-3 text-xs sm:text-sm font-medium text-secondary">Rol</th>
                  <th className="text-left py-2 px-2 sm:px-3 text-xs sm:text-sm font-medium text-secondary">Estado</th>
                  {puedeModificar && (
                    <th className="text-right py-2 px-2 sm:px-3 text-xs sm:text-sm font-medium text-secondary">Acciones</th>
                  )}
                </tr>
              </thead>
              <tbody>
                {usuarios.map((usuario) => (
                  <tr key={usuario.id} className="border-b border-outline-variant/10 hover:bg-surface-container/50">
                    <td className="py-2 sm:py-3 px-2 sm:px-3 text-xs sm:text-sm">{usuario.username}</td>
                    <td className="py-2 sm:py-3 px-2 sm:px-3 text-xs sm:text-sm">{getRolLabel(usuario.rol)}</td>
                    <td className="py-2 sm:py-3 px-2 sm:px-3 text-xs sm:text-sm">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        usuario.activo 
                          ? 'bg-tertiary-container text-on-tertiary-container' 
                          : 'bg-secondary-container text-on-secondary-container'
                      }`}>
                        {usuario.activo ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>
                    {puedeModificar && (
                      <td className="py-2 sm:py-3 px-2 sm:px-3 text-right">
                        <button
                          onClick={() => abrirEditar(usuario)}
                          className="text-primary hover:underline text-xs sm:text-sm mr-2 sm:mr-3"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => setUsuarioAEliminar(usuario)}
                          className="text-error hover:underline text-xs sm:text-sm"
                        >
                          Eliminar
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal de usuario */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <form
            onSubmit={handleGuardado}
            style={{ width: '90vw', maxWidth: '500px', minWidth: '300px' }}
            className="bg-surface-container-lowest rounded-lg shadow-2xl p-6 flex flex-col gap-4"
          >
            <h2 className="font-headline-md text-xl font-bold text-primary">
              {usuarioEditando?.id ? 'Editar usuario' : 'Nuevo usuario'}
            </h2>

            <label className="flex flex-col gap-1 text-sm font-medium">
              Usuario
              <input
                type="text"
                value={usuarioEditando?.username || ''}
                onChange={(e) => setUsuarioEditando({ ...usuarioEditando, username: e.target.value })}
                required
                className="border border-outline-variant rounded-sm p-2 w-full text-sm focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </label>

            <label className="flex flex-col gap-1 text-sm font-medium">
              Contraseña {usuarioEditando?.id ? '(dejar vacío para mantener)' : ''}
              <input
                type="password"
                value={usuarioEditando?.password || ''}
                onChange={(e) => setUsuarioEditando({ ...usuarioEditando, password: e.target.value })}
                required={!usuarioEditando?.id}
                className="border border-outline-variant rounded-sm p-2 w-full text-sm focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </label>

            <label className="flex flex-col gap-1 text-sm font-medium">
              Rol
              <select
                value={usuarioEditando?.rol || 'EMPLEADA'}
                onChange={(e) => setUsuarioEditando({ ...usuarioEditando, rol: e.target.value })}
                required
                className="border border-outline-variant rounded-sm p-2 w-full text-sm focus:outline-none focus:ring-1 focus:ring-primary bg-surface-container-lowest"
              >
                {ROLES_USUARIO.map((rol) => (
                  <option key={rol.value} value={rol.value}>{rol.label}</option>
                ))}
              </select>
            </label>

            <label className="flex items-center gap-2 text-sm font-medium">
              <input
                type="checkbox"
                checked={usuarioEditando?.activo ?? true}
                onChange={(e) => setUsuarioEditando({ ...usuarioEditando, activo: e.target.checked })}
                className="w-4 h-4"
              />
              Activo
            </label>

            {error && <p className="text-error text-sm">{error}</p>}

            <div className="flex justify-end gap-3 mt-2 pt-2 border-t border-outline-variant/30">
              <button
                type="button"
                onClick={() => {
                  setModalOpen(false)
                  setUsuarioEditando(null)
                  setError('')
                }}
                className="px-4 py-2 text-sm text-secondary hover:text-primary transition-colors cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="bg-primary text-on-primary px-5 py-2 rounded-md text-sm font-semibold hover:opacity-90 transition-opacity cursor-pointer"
              >
                Guardar
              </button>
            </div>
          </form>
        </div>
      )}

      {usuarioAEliminar && (
        <ConfirmDialog
          title="¿Eliminar usuario?"
          message="Esto eliminará el usuario permanentemente."
          onConfirm={confirmarEliminar}
          onCancel={() => setUsuarioAEliminar(null)}
        />
      )}
    </div>
  )
}

export default Usuarios
