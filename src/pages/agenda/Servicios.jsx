import { useState, useEffect, useCallback } from 'react'
import { useAgendaApi } from '../../hooks/useAgendaApi'
import { useAgendaAuth } from '../../context/AgendaAuthContext'
import ServicioFormModal from '../../components/agenda/ServicioFormModal'
import ConfirmDialog from '../../components/agenda/ConfirmDialog'

const Servicios = () => {
  const { request } = useAgendaApi()
  const { user } = useAgendaAuth()
  const puedeModificar = user?.rol === 'ADMIN' || user?.rol === 'JEFA'

  const [servicios, setServicios] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [busqueda, setBusqueda] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [servicioEditando, setServicioEditando] = useState(null)
  const [servicioAEliminar, setServicioAEliminar] = useState(null)

  const cargarServicios = useCallback(async (nombre = '') => {
    setLoading(true)
    setError('')
    try {
      const path = nombre.trim()
        ? `/Servicios/nombre/${encodeURIComponent(nombre.trim())}`
        : '/Servicios'
      const res = await request(path)
      if (!res.ok) throw new Error('No se pudieron cargar los servicios')
      setServicios(await res.json())
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [request])

  useEffect(() => {
    cargarServicios()
  }, [cargarServicios])

  const handleBusqueda = (e) => {
    e.preventDefault()
    cargarServicios(busqueda)
  }

  const abrirCrear = () => {
    setServicioEditando(null)
    setModalOpen(true)
  }

  const abrirEditar = (servicio) => {
    setServicioEditando(servicio)
    setModalOpen(true)
  }

  const handleGuardado = () => {
    setModalOpen(false)
    cargarServicios(busqueda)
  }

  const confirmarEliminar = async () => {
    try {
      const res = await request(`/Servicios/id/${servicioAEliminar.id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('No se pudo eliminar el servicio')
      setServicioAEliminar(null)
      cargarServicios(busqueda)
    } catch (err) {
      setError(err.message)
      setServicioAEliminar(null)
    }
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-sm mb-lg">
        <h1 className="font-headline-md text-2xl text-primary">Servicios</h1>
        {puedeModificar && (
          <button
            onClick={abrirCrear}
            className="bg-primary text-on-primary px-lg py-sm rounded-sm font-label-md hover:opacity-90 transition-opacity"
          >
            + Nuevo servicio
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
            onClick={() => { setBusqueda(''); cargarServicios('') }}
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
      ) : servicios.length === 0 ? (
        <p className="text-secondary">No se encontraron servicios.</p>
      ) : (
        <div className="overflow-x-auto bg-surface-container-lowest rounded-sm border border-outline-variant/20">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-outline-variant/20 text-left">
                <th className="px-md py-sm font-label-md text-secondary">Nombre</th>
                <th className="px-md py-sm font-label-md text-secondary">Tipo</th>
                <th className="px-md py-sm font-label-md text-secondary">Duración</th>
                <th className="px-md py-sm font-label-md text-secondary">Precio</th>
                {puedeModificar && (
                  <th className="px-md py-sm font-label-md text-secondary text-right">Acciones</th>
                )}
              </tr>
            </thead>
            <tbody>
              {servicios.map((s) => (
                <tr key={s.id} className="border-b border-outline-variant/10 last:border-0">
                  <td className="px-md py-sm">{s.nombre}</td>
                  <td className="px-md py-sm capitalize">{s.tipo.toLowerCase().replace('_', ' ')}</td>
                  <td className="px-md py-sm">{s.duracion} min</td>
                  <td className="px-md py-sm">${Number(s.precio).toFixed(2)}</td>
                  {puedeModificar && (
                    <td className="px-md py-sm text-right">
                      <button
                        onClick={() => abrirEditar(s)}
                        className="text-primary hover:underline text-sm mr-md"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => setServicioAEliminar(s)}
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
        <ServicioFormModal
          servicio={servicioEditando}
          onClose={() => setModalOpen(false)}
          onSaved={handleGuardado}
        />
      )}

      {servicioAEliminar && (
        <ConfirmDialog
          title="¿Eliminar servicio?"
          message={`Esto eliminará "${servicioAEliminar.nombre}" permanentemente.`}
          onConfirm={confirmarEliminar}
          onCancel={() => setServicioAEliminar(null)}
        />
      )}
    </div>
  )
}

export default Servicios