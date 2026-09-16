import { useState, useEffect, useCallback } from 'react'
import { useAgendaApi } from '../../hooks/useAgendaApi'
import { useAgendaAuth } from '../../context/AgendaAuthContext'
import PlantillaFormModal from '../../components/agenda/PlantillaFormModal'
import ConfirmDialog from '../../components/agenda/ConfirmDialog'

const Plantillas = () => {
  const { request } = useAgendaApi()
  const { user } = useAgendaAuth()
  const puedeModificar = user?.rol === 'ADMIN'

  const [plantillas, setPlantillas] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [busqueda, setBusqueda] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [plantillaEditando, setPlantillaEditando] = useState(null)
  const [plantillaAEliminar, setPlantillaAEliminar] = useState(null)

  const cargarPlantillas = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const res = await request('/Plantillas')
      if (!res.ok) throw new Error('No se pudieron cargar las plantillas')
      const todasLasPlantillas = await res.json()
      
      // Filtrar localmente si hay búsqueda
      if (busqueda.trim()) {
        const filtradas = todasLasPlantillas.filter(p =>
          p.nombreMeta.toLowerCase().includes(busqueda.toLowerCase())
        )
        setPlantillas(filtradas)
      } else {
        setPlantillas(todasLasPlantillas)
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [request, busqueda])

  useEffect(() => {
    cargarPlantillas()
  }, [])

  const handleBusqueda = (e) => {
    e.preventDefault()
    cargarPlantillas()
  }

  const abrirCrear = () => {
    setPlantillaEditando(null)
    setModalOpen(true)
  }

  const abrirEditar = (plantilla) => {
    setPlantillaEditando(plantilla)
    setModalOpen(true)
  }

  const handleGuardado = () => {
    setModalOpen(false)
    cargarPlantillas(busqueda)
  }

  const confirmarEliminar = async () => {
    try {
      const res = await request(`/Plantillas/id/${plantillaAEliminar.id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('No se pudo eliminar la plantilla')
      setPlantillaAEliminar(null)
      cargarPlantillas(busqueda)
    } catch (err) {
      setError(err.message)
      setPlantillaAEliminar(null)
    }
  }

  const getTipoLabel = (tipo) => {
    const tipos = {
      'RECORDATORIO': 'Recordatorio',
      'SEGUIMIENTO': 'Seguimiento',
      'CUMPLE': 'Cumpleaños'
    }
    return tipos[tipo] || tipo
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-sm mb-lg">
        <h1 className="font-headline-md text-2xl text-primary">Plantillas</h1>
        {puedeModificar && (
          <button
            onClick={abrirCrear}
            className="bg-primary text-on-primary px-lg py-sm rounded-sm font-label-md hover:opacity-90 transition-opacity"
          >
            + Nueva plantilla
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
            onClick={() => { setBusqueda(''); cargarPlantillas() }}
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
      ) : plantillas.length === 0 ? (
        <p className="text-secondary">No se encontraron plantillas.</p>
      ) : (
        <div className="overflow-x-auto bg-surface-container-lowest rounded-sm border border-outline-variant/20">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-outline-variant/20 text-left">
                <th className="px-md py-sm font-label-md text-secondary">Nombre</th>
                <th className="px-md py-sm font-label-md text-secondary">Tipo</th>
                <th className="px-md py-sm font-label-md text-secondary">Días Offset</th>
                <th className="px-md py-sm font-label-md text-secondary">Servicios</th>
                {puedeModificar && (
                  <th className="px-md py-sm font-label-md text-secondary text-right">Acciones</th>
                )}
              </tr>
            </thead>
            <tbody>
              {plantillas.map((p) => (
                <tr key={p.id} className="border-b border-outline-variant/10 last:border-0">
                  <td className="px-md py-sm">{p.nombreMeta}</td>
                  <td className="px-md py-sm capitalize">{getTipoLabel(p.tipo)}</td>
                  <td className="px-md py-sm">{p.diasOffset !== null ? p.diasOffset : '—'}</td>
                  <td className="px-md py-sm">
                    {p.idsServicios && p.idsServicios.length > 0 ? (
                      <span className="text-xs bg-primary-container text-on-primary-container px-2 py-0.5 rounded-full">
                        {p.idsServicios.length} servicio{p.idsServicios.length > 1 ? 's' : ''}
                      </span>
                    ) : (
                      <span className="text-secondary text-xs">Sin servicios</span>
                    )}
                  </td>
                  {puedeModificar && (
                    <td className="px-md py-sm text-right">
                      <button
                        onClick={() => abrirEditar(p)}
                        className="text-primary hover:underline text-sm mr-md"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => setPlantillaAEliminar(p)}
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
        <PlantillaFormModal
          plantilla={plantillaEditando}
          onClose={() => setModalOpen(false)}
          onSaved={handleGuardado}
        />
      )}

      {plantillaAEliminar && (
        <ConfirmDialog
          title="¿Eliminar plantilla?"
          message={`Esto eliminará "${plantillaAEliminar.nombreMeta}" permanentemente.`}
          onConfirm={confirmarEliminar}
          onCancel={() => setPlantillaAEliminar(null)}
        />
      )}
    </div>
  )
}

export default Plantillas