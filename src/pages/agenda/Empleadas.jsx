import { useState, useEffect, useCallback, useMemo } from 'react'
import { useAgendaApi } from '../../hooks/useAgendaApi'
import { useAgendaAuth } from '../../context/AgendaAuthContext'
import EmpleadaFormModal from '../../components/agenda/EmpleadaFormModal'
import ConfirmDialog from '../../components/agenda/ConfirmDialog'
import { Avatar, Aviso, Chip, ErrorBanner, Fab, SearchInput, Titulo } from '../../components/agenda/ui'
import { CARD, normalizar } from '../../components/agenda/estilos'

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

  const cargar = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const res = await request('/Empleadas')
      if (!res.ok) throw new Error('No se pudieron cargar las empleadas')
      setEmpleadas(await res.json())
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
    return empleadas.filter((e) => !q || normalizar(e.nombre).includes(q))
  }, [empleadas, busqueda])

  const abrirCrear = () => {
    setEmpleadaEditando(null)
    setModalOpen(true)
  }

  const abrirEditar = (e) => {
    if (!puedeModificar) return
    setEmpleadaEditando(e)
    setModalOpen(true)
  }

  const pedirEliminar = () => {
    setModalOpen(false)
    setEmpleadaAEliminar(empleadaEditando)
  }

  const confirmarEliminar = async () => {
    try {
      const res = await request(`/Empleadas/id/${empleadaAEliminar.id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('No se pudo eliminar la empleada')
      setEmpleadaAEliminar(null)
      cargar()
    } catch (err) {
      setError(err.message)
      setEmpleadaAEliminar(null)
    }
  }

  return (
    <div>
      <Titulo>Empleadas</Titulo>
      <SearchInput value={busqueda} onChange={setBusqueda} placeholder="Buscar por nombre..." />
      {error && <ErrorBanner>{error}</ErrorBanner>}

      {loading ? (
        <Aviso>Cargando...</Aviso>
      ) : visibles.length === 0 ? (
        <Aviso>No se encontraron empleadas.</Aviso>
      ) : (
        <div className="grid gap-3 md:grid-cols-2">
          {visibles.map((e) => (
            <div
              key={e.id}
              role={puedeModificar ? 'button' : undefined}
              tabIndex={puedeModificar ? 0 : undefined}
              onClick={() => abrirEditar(e)}
              onKeyDown={(ev) => ev.key === 'Enter' && abrirEditar(e)}
              className={`${CARD} flex items-center gap-3 ${puedeModificar ? 'cursor-pointer' : ''}`}
            >
              <Avatar nombre={e.nombre} />
              <div className="min-w-0 flex-1">
                <p className="truncate font-semibold">{e.nombre}</p>
                <p className="text-xs text-secondary">Usuario #{e.idUsuario}</p>
              </div>
              <Chip tono={e.activo ? 'sage' : 'sand'}>{e.activo ? 'Activa' : 'Inactiva'}</Chip>
            </div>
          ))}
        </div>
      )}

      {puedeModificar && <Fab onClick={abrirCrear}>Nueva empleada</Fab>}

      {modalOpen && (
        <EmpleadaFormModal
          empleada={empleadaEditando}
          onClose={() => setModalOpen(false)}
          onSaved={() => {
            setModalOpen(false)
            cargar()
          }}
          onDelete={pedirEliminar}
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