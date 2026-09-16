import { useState, useEffect, useCallback } from 'react'
import { useAgendaApi } from '../../hooks/useAgendaApi'
import ClientaFormModal from '../../components/agenda/ClientaFormModal'
import ConfirmDialog from '../../components/agenda/ConfirmDialog'

const Clientas = () => {
  const { request } = useAgendaApi()
  const [clientas, setClientas] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [busqueda, setBusqueda] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [clientaEditando, setClientaEditando] = useState(null)
  const [clientaAEliminar, setClientaAEliminar] = useState(null)

  const cargarClientas = useCallback(async (nombre = '') => {
    setLoading(true)
    setError('')
    try {
      const path = nombre.trim()
        ? `/Clientas/nombre/${encodeURIComponent(nombre.trim())}`
        : '/Clientas'
      const res = await request(path)
      if (!res.ok) throw new Error('No se pudieron cargar las clientas')
      setClientas(await res.json())
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [request])

  useEffect(() => {
    cargarClientas()
  }, [cargarClientas])

  const handleBusqueda = (e) => {
    e.preventDefault()
    cargarClientas(busqueda)
  }

  const abrirCrear = () => {
    setClientaEditando(null)
    setModalOpen(true)
  }

  const abrirEditar = (clienta) => {
    setClientaEditando(clienta)
    setModalOpen(true)
  }

  const handleGuardado = () => {
    setModalOpen(false)
    cargarClientas(busqueda)
  }

  const confirmarEliminar = async () => {
    try {
      const res = await request(`/Clientas/id/${clientaAEliminar.id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('No se pudo eliminar la clienta')
      setClientaAEliminar(null)
      cargarClientas(busqueda)
    } catch (err) {
      setError(err.message)
      setClientaAEliminar(null)
    }
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-sm mb-lg">
        <h1 className="font-headline-md text-2xl text-primary">Clientas</h1>
        <button
          onClick={abrirCrear}
          className="bg-primary text-on-primary px-lg py-sm rounded-sm font-label-md hover:opacity-90 transition-opacity"
        >
          + Nueva clienta
        </button>
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
            onClick={() => { setBusqueda(''); cargarClientas('') }}
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
      ) : clientas.length === 0 ? (
        <p className="text-secondary">No se encontraron clientas.</p>
      ) : (
        <div className="overflow-x-auto bg-surface-container-lowest rounded-sm border border-outline-variant/20">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-outline-variant/20 text-left">
                <th className="px-md py-sm font-label-md text-secondary">Nombre</th>
                <th className="px-md py-sm font-label-md text-secondary">Teléfono</th>
                <th className="px-md py-sm font-label-md text-secondary">Cumpleaños</th>
                <th className="px-md py-sm font-label-md text-secondary">Opt-in</th>
                <th className="px-md py-sm font-label-md text-secondary text-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {clientas.map((c) => (
                <tr key={c.id} className="border-b border-outline-variant/10 last:border-0">
                  <td className="px-md py-sm">{c.nombre}</td>
                  <td className="px-md py-sm">{c.telefono}</td>
                  <td className="px-md py-sm">{c.fechaNacimiento || '—'}</td>
                  <td className="px-md py-sm">
                    <div className="flex gap-1">
                      {c.recordatorios && (
                        <span className="text-xs bg-primary-container text-on-primary-container px-2 py-0.5 rounded-full">
                          Recordatorios
                        </span>
                      )}
                      {c.marketing && (
                        <span className="text-xs bg-tertiary-container text-on-tertiary-container px-2 py-0.5 rounded-full">
                          Marketing
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-md py-sm text-right">
                    <button
                      onClick={() => abrirEditar(c)}
                      className="text-primary hover:underline text-sm mr-md"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => setClientaAEliminar(c)}
                      className="text-error hover:underline text-sm"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {modalOpen && (
        <ClientaFormModal
          clienta={clientaEditando}
          onClose={() => setModalOpen(false)}
          onSaved={handleGuardado}
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