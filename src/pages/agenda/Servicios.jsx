import { useState, useEffect, useCallback, useMemo } from 'react'
import { useAgendaApi } from '../../hooks/useAgendaApi'
import { useAgendaAuth } from '../../context/AgendaAuthContext'
import ServicioFormModal from '../../components/agenda/ServicioFormModal'
import ConfirmDialog from '../../components/agenda/ConfirmDialog'
import { Aviso, Chip, ErrorBanner, Fab, SearchInput, Titulo } from '../../components/agenda/ui'
import { CARD, normalizar } from '../../components/agenda/estilos'

const TIPOS = {
  CORTE: 'Corte',
  COLOR: 'Color',
  PEINADO_TRATAMIENTO: 'Peinado / Tratamiento',
  CEJAS_PESTANAS: 'Cejas / Pestañas',
  UNAS_MANOS: 'Uñas de manos',
  UNAS_PIES: 'Uñas de pies',
}

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

  const cargar = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const res = await request('/Servicios')
      if (!res.ok) throw new Error('No se pudieron cargar los servicios')
      setServicios(await res.json())
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
    return servicios.filter((s) => !q || normalizar(s.nombre).includes(q))
  }, [servicios, busqueda])

  const abrirCrear = () => {
    setServicioEditando(null)
    setModalOpen(true)
  }

  const abrirEditar = (s) => {
    if (!puedeModificar) return
    setServicioEditando(s)
    setModalOpen(true)
  }

  const pedirEliminar = () => {
    setModalOpen(false)
    setServicioAEliminar(servicioEditando)
  }

  const confirmarEliminar = async () => {
    try {
      const res = await request(`/Servicios/id/${servicioAEliminar.id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('No se pudo eliminar el servicio')
      setServicioAEliminar(null)
      cargar()
    } catch (err) {
      setError(err.message)
      setServicioAEliminar(null)
    }
  }

  return (
    <div>
      <Titulo>Servicios</Titulo>
      <SearchInput value={busqueda} onChange={setBusqueda} placeholder="Buscar servicio..." />
      {error && <ErrorBanner>{error}</ErrorBanner>}

      {loading ? (
        <Aviso>Cargando...</Aviso>
      ) : visibles.length === 0 ? (
        <Aviso>No se encontraron servicios.</Aviso>
      ) : (
        <div className="grid gap-3 md:grid-cols-2">
          {visibles.map((s) => (
            <div
              key={s.id}
              role={puedeModificar ? 'button' : undefined}
              tabIndex={puedeModificar ? 0 : undefined}
              onClick={() => abrirEditar(s)}
              onKeyDown={(e) => e.key === 'Enter' && abrirEditar(s)}
              className={`${CARD} flex items-center gap-3 ${puedeModificar ? 'cursor-pointer' : ''}`}
            >
              <div className="min-w-0 flex-1">
                <p className="font-semibold">{s.nombre}</p>
                <p className="mt-0.5 text-sm text-secondary">{s.duracion} min</p>
                <div className="mt-1.5">
                  <Chip tono="sand">{TIPOS[s.tipo] ?? s.tipo}</Chip>
                </div>
              </div>
              <p className="text-lg font-semibold text-primary">${Number(s.precio).toFixed(0)}</p>
            </div>
          ))}
        </div>
      )}

      {puedeModificar && <Fab onClick={abrirCrear}>Nuevo servicio</Fab>}

      {modalOpen && (
        <ServicioFormModal
          servicio={servicioEditando}
          onClose={() => setModalOpen(false)}
          onSaved={() => {
            setModalOpen(false)
            cargar()
          }}
          onDelete={pedirEliminar}
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