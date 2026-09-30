import { useState, useEffect, useCallback, useMemo } from 'react'
import { useAgendaApi } from '../../hooks/useAgendaApi'
import { useAgendaAuth } from '../../context/AgendaAuthContext'
import PlantillaFormModal from '../../components/agenda/PlantillaFormModal'
import ConfirmDialog from '../../components/agenda/ConfirmDialog'
import { Aviso, Chip, ErrorBanner, Fab, SearchInput, Titulo } from '../../components/agenda/ui'
import { CARD, normalizar } from '../../components/agenda/estilos'

const TIPOS = { RECORDATORIO: 'Recordatorio', SEGUIMIENTO: 'Seguimiento', CUMPLE: 'Cumpleaños' }

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

  const cargar = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const res = await request('/Plantillas')
      if (!res.ok) throw new Error('No se pudieron cargar las plantillas')
      setPlantillas(await res.json())
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [request])

  useEffect(() => {
    cargar()
  }, [cargar])

  const visibles = useMemo(() => {
    const q = normalizar(busqueda.trim())
    return plantillas.filter((p) => !q || normalizar(p.nombreMeta).includes(q))
  }, [plantillas, busqueda])

  const abrirCrear = () => {
    setPlantillaEditando(null)
    setModalOpen(true)
  }

  const abrirEditar = (p) => {
    if (!puedeModificar) return
    setPlantillaEditando(p)
    setModalOpen(true)
  }

  const pedirEliminar = () => {
    setModalOpen(false)
    setPlantillaAEliminar(plantillaEditando)
  }

  const confirmarEliminar = async () => {
    try {
      const res = await request(`/Plantillas/id/${plantillaAEliminar.id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('No se pudo eliminar la plantilla')
      setPlantillaAEliminar(null)
      cargar()
    } catch (err) {
      setError(err.message)
      setPlantillaAEliminar(null)
    }
  }

  return (
    <div>
      <Titulo>Plantillas</Titulo>
      <SearchInput value={busqueda} onChange={setBusqueda} placeholder="Buscar por nombre..." />
      {error && <ErrorBanner>{error}</ErrorBanner>}

      {loading ? (
        <Aviso>Cargando...</Aviso>
      ) : visibles.length === 0 ? (
        <Aviso>No se encontraron plantillas.</Aviso>
      ) : (
        <div className="grid gap-3 md:grid-cols-2">
          {visibles.map((p) => (
            <div
              key={p.id}
              role={puedeModificar ? 'button' : undefined}
              tabIndex={puedeModificar ? 0 : undefined}
              onClick={() => abrirEditar(p)}
              onKeyDown={(e) => e.key === 'Enter' && abrirEditar(p)}
              className={`${CARD} flex items-center gap-3 ${puedeModificar ? 'cursor-pointer' : ''}`}
            >
              <div className="h-14 w-14 shrink-0 overflow-hidden rounded-xl border border-outline-variant bg-surface-container-low">
                {p.headerImageUrl && (
                  <img
                    src={p.headerImageUrl}
                    alt=""
                    className="h-full w-full object-cover"
                    onError={(e) => {
                      e.target.style.display = 'none'
                    }}
                  />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate font-semibold">{p.nombreMeta}</p>
                <p className="text-xs text-secondary">
                  {p.diasOffset !== null && p.diasOffset !== undefined
                    ? `Offset: ${p.diasOffset} día${Math.abs(p.diasOffset) === 1 ? '' : 's'}`
                    : 'Sin offset'}
                  {' · '}
                  {p.idsServicios?.length
                    ? `${p.idsServicios.length} servicio${p.idsServicios.length > 1 ? 's' : ''}`
                    : 'Sin servicios'}
                </p>
                <div className="mt-1.5">
                  <Chip>{TIPOS[p.tipo] ?? p.tipo}</Chip>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {puedeModificar && <Fab onClick={abrirCrear}>Nueva plantilla</Fab>}

      {modalOpen && (
        <PlantillaFormModal
          plantilla={plantillaEditando}
          onClose={() => setModalOpen(false)}
          onSaved={() => {
            setModalOpen(false)
            cargar()
          }}
          onDelete={pedirEliminar}
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