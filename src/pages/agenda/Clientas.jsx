import { useState, useEffect, useCallback, useMemo } from 'react'
import { format, parseISO } from 'date-fns'
import { es } from 'date-fns/locale'
import { useAgendaApi } from '../../hooks/useAgendaApi'
import ClientaFormModal from '../../components/agenda/ClientaFormModal'
import ConfirmDialog from '../../components/agenda/ConfirmDialog'
import Icon from '../../components/agenda/Icon'
import { Avatar, Aviso, Chip, ErrorBanner, Fab, SearchInput, Titulo } from '../../components/agenda/ui'
import { CARD, normalizar } from '../../components/agenda/estilos'

const Clientas = () => {
  const { request } = useAgendaApi()
  const [clientas, setClientas] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [busqueda, setBusqueda] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [clientaEditando, setClientaEditando] = useState(null)
  const [clientaAEliminar, setClientaAEliminar] = useState(null)

  const cargar = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const res = await request('/Clientas')
      if (!res.ok) throw new Error('No se pudieron cargar las clientas')
      setClientas(await res.json())
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [request])

  useEffect(() => {
    cargar()
  }, [cargar])

  // La búsqueda es local: instantánea y sin pedir nada al servidor
  const visibles = useMemo(() => {
    const q = normalizar(busqueda.trim())
    return clientas
      .filter((c) => !q || normalizar(c.nombre).includes(q) || c.telefono?.includes(q))
      .sort((a, b) => a.nombre.localeCompare(b.nombre, 'es'))
  }, [clientas, busqueda])

  const abrirCrear = () => {
    setClientaEditando(null)
    setModalOpen(true)
  }

  const abrirEditar = (c) => {
    setClientaEditando(c)
    setModalOpen(true)
  }

  const pedirEliminar = () => {
    setModalOpen(false)
    setClientaAEliminar(clientaEditando)
  }

  const confirmarEliminar = async () => {
    try {
      const res = await request(`/Clientas/id/${clientaAEliminar.id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('No se pudo eliminar la clienta')
      setClientaAEliminar(null)
      cargar()
    } catch (err) {
      setError(err.message)
      setClientaAEliminar(null)
    }
  }

  const detener = (e) => e.stopPropagation()

  return (
    <div>
      <Titulo>Clientas</Titulo>
      <SearchInput value={busqueda} onChange={setBusqueda} placeholder="Buscar por nombre o teléfono..." />
      {error && <ErrorBanner>{error}</ErrorBanner>}

      {loading ? (
        <Aviso>Cargando...</Aviso>
      ) : visibles.length === 0 ? (
        <Aviso>No se encontraron clientas.</Aviso>
      ) : (
        <div className="grid gap-3 md:grid-cols-2">
          {visibles.map((c) => (
            <div
              key={c.id}
              role="button"
              tabIndex={0}
              onClick={() => abrirEditar(c)}
              onKeyDown={(e) => e.key === 'Enter' && abrirEditar(c)}
              className={`${CARD} flex cursor-pointer items-center gap-3`}
            >
              <Avatar nombre={c.nombre} />
              <div className="min-w-0 flex-1">
                <p className="truncate font-semibold">{c.nombre}</p>
                <p className="text-sm text-secondary">+{c.telefono}</p>
                {c.fechaNacimiento && (
                  <p className="text-xs text-secondary">
                    Cumple: {format(parseISO(c.fechaNacimiento), "d 'de' MMM", { locale: es })}
                  </p>
                )}
                {(c.recordatorios || c.marketing) && (
                  <div className="mt-1.5 flex flex-wrap gap-1">
                    {c.recordatorios && <Chip>Recordatorios</Chip>}
                    {c.marketing && <Chip tono="sand">Marketing</Chip>}
                  </div>
                )}
              </div>
              <a
                href={`tel:+${c.telefono}`}
                onClick={detener}
                aria-label="Llamar"
                className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-surface-container text-secondary"
              >
                <Icon name="phone" className="h-5 w-5" />
              </a>
              <a
                href={`https://wa.me/${c.telefono}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={detener}
                aria-label="Escribir por WhatsApp"
                className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-primary-container text-primary"
              >
                <Icon name="chat" className="h-5 w-5" />
              </a>
            </div>
          ))}
        </div>
      )}

      <Fab onClick={abrirCrear}>Nueva clienta</Fab>

      {modalOpen && (
        <ClientaFormModal
          clienta={clientaEditando}
          onClose={() => setModalOpen(false)}
          onSaved={() => {
            setModalOpen(false)
            cargar()
          }}
          onDelete={pedirEliminar}
        />
      )}

      {clientaAEliminar && (
        <ConfirmDialog
          title="¿Eliminar clienta?"
          message={`Esto eliminará a "${clientaAEliminar.nombre}" permanentemente.`}
          onConfirm={confirmarEliminar}
          onCancel={() => setClientaAEliminar(null)}
        />
      )}
    </div>
  )
}

export default Clientas