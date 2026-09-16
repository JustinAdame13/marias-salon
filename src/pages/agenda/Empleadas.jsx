import { useState, useEffect, useCallback } from 'react'
import { useAgendaApi } from '../../hooks/useAgendaApi'
import { useAgendaAuth } from '../../context/AgendaAuthContext'
import EmpleadaFormModal from '../../components/agenda/EmpleadaFormModal'
import ConfirmDialog from '../../components/agenda/ConfirmDialog'

const Empleadas = () => {
  const { request } = useAgendaApi()
  const { user } = useAgendaAuth()
  const puedeModificar = user?.rol === 'ADMIN'

  const [empleadas, setEmpleadas] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [busqueda, setBusqueda] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [empleadaEditando, setEmpleadaEditando] = useState(null)
  const [empleadaAEliminar, setEmpleadaAEliminar] = useState(null)

  const cargarEmpleadas = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const res = await request('/Empleadas')
      if (!res.ok) throw new Error('No se pudieron cargar las empleadas')
      const todasLasEmpleadas = await res.json()
      
      // Filtrar localmente si hay búsqueda
      if (busqueda.trim()) {
        const filtradas = todasLasEmpleadas.filter(e =>
          e.nombre.toLowerCase().includes(busqueda.toLowerCase())
        )
        setEmpleadas(filtradas)
      } else {
        setEmpleadas(todasLasEmpleadas)
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [request, busqueda])

  useEffect(() => {
    cargarEmpleadas()
  }, [])

  const handleBusqueda = (e) => {
    e.preventDefault()
    cargarEmpleadas()
  }

  const abrirCrear = () => {
    setEmpleadaEditando(null)
    setModalOpen(true)
  }

  const abrirEditar = (empleada) => {
    setEmpleadaEditando(empleada)
    setModalOpen(true)
  }

  const handleGuardado = () => {
    setModalOpen(false)
    cargarEmpleadas()
  }

  const confirmarEliminar = async () => {
    try {
      const res = await request(`/Empleadas/id/${empleadaAEliminar.id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('No se pudo eliminar la empleada')
      setEmpleadaAEliminar(null)
      cargarEmpleadas()
    } catch (err) {
      setError(err.message)
      setEmpleadaAEliminar(null)
    }
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-sm mb-lg">
        <h1 className="font-headline-md text-2xl text-primary">Empleadas</h1>
        {puedeModificar && (
          <button
            onClick={abrirCrear}
            className="bg-primary text-on-primary px-lg py-sm rounded-sm font-label-md hover:opacity-90 transition-opacity"
          >
            + Nueva empleada
          </button>
        )}
      </div>

      <form onSubmit={handleBusqueda} className="flex gap-sm mb-lg">
        <input
          type="text"
          placeholder="Buscar por nombre..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="flex-1 border border-outline-variant rounded-sm px-md py-sm"
        />
        <button
          type="submit"
          className="border border-primary text-primary px-md py-sm rounded-sm hover:bg-primary hover:text-on-primary transition-all"
        >
          Buscar
        </button>
        {busqueda && (
          <button
            type="button"
            onClick={() => { setBusqueda(''); cargarEmpleadas() }}
            className="text-sm text-secondary hover:text-primary underline"
          >
            Limpiar
          </button>
        )}
      </form>

      {error && (
        <div className="bg-error-container text-on-error-container px-md py-sm rounded-sm mb-md text-sm">
          {error}
        </div>
      )}

      {loading ? (
        <p className="text-secondary">Cargando...</p>
      ) : empleadas.length === 0 ? (
        <p className="text-secondary">No se encontraron empleadas.</p>
      ) : (
        <div className="overflow-x-auto bg-surface-container-lowest rounded-sm border border-outline-variant/20">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-outline-variant/20 text-left">
                <th className="px-md py-sm font-label-md text-secondary">Nombre</th>
                <th className="px-md py-sm font-label-md text-secondary">Usuario ID</th>
                <th className="px-md py-sm font-label-md text-secondary">Estado</th>
                {puedeModificar && (
                  <th className="px-md py-sm font-label-md text-secondary text-right">Acciones</th>
                )}
              </tr>
            </thead>
            <tbody>
              {empleadas.map((e) => (
                <tr key={e.id} className="border-b border-outline-variant/10 last:border-0">
                  <td className="px-md py-sm">{e.nombre}</td>
                  <td className="px-md py-sm">{e.idUsuario}</td>
                  <td className="px-md py-sm">
                    {e.activo ? (
                      <span className="text-xs bg-primary-container text-on-primary-container px-2 py-0.5 rounded-full">
                        Activa
                      </span>
                    ) : (
                      <span className="text-xs bg-error-container text-on-error-container px-2 py-0.5 rounded-full">
                        Inactiva
                      </span>
                    )}
                  </td>
                  {puedeModificar && (
                    <td className="px-md py-sm text-right">
                      <button
                        onClick={() => abrirEditar(e)}
                        className="text-primary hover:underline text-sm mr-md"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => setEmpleadaAEliminar(e)}
                        className="text-error hover:underline text-sm"
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

      {modalOpen && (
        <EmpleadaFormModal
          empleada={empleadaEditando}
          onClose={() => setModalOpen(false)}
          onSaved={handleGuardado}
        />
      )}

      {empleadaAEliminar && (
        <ConfirmDialog
          title="¿Eliminar empleada?"
          message={`Esto eliminará a "${empleadaAEliminar.nombre}" permanentemente.`}
          onConfirm={confirmarEliminar}
          onCancel={() => setEmpleadaAEliminar(null)}
        />
      )}
    </div>
  )
}

export default Empleadas