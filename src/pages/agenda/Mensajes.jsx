import { useState, useEffect, useCallback, useMemo } from 'react'
import { format, parseISO, isToday, startOfDay } from 'date-fns'
import { es } from 'date-fns/locale'
import { useAgendaApi } from '../../hooks/useAgendaApi'
import { useAgendaAuth } from '../../context/AgendaAuthContext'
import ConfirmDialog from '../../components/agenda/ConfirmDialog'
import { Aviso, Chip, ErrorBanner, Titulo } from '../../components/agenda/ui'
import { CARD } from '../../components/agenda/estilos'

const ESTADOS = {
  PROGRAMADO: { label: 'Programado', tono: 'primary', acento: 'bg-[#7d484e]' },
  ENVIADO: { label: 'Enviado', tono: 'sage', acento: 'bg-[#c99a96]' },
  FALLIDO: { label: 'Fallido', tono: 'error', acento: 'bg-error' },
}

const TIPOS_PLANTILLA = { RECORDATORIO: 'Recordatorio', SEGUIMIENTO: 'Seguimiento', CUMPLE: 'Cumpleaños' }

const Mensajes = () => {
  const { request } = useAgendaApi()
  const { user } = useAgendaAuth()
  const puedeModificar = user?.rol === 'ADMIN' || user?.rol === 'JEFA'

  const [mensajes, setMensajes] = useState([])
  const [plantillas, setPlantillas] = useState([])
  const [clientas, setClientas] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [vista, setVista] = useState('proximos')
  const [filtro, setFiltro] = useState('')
  const [mensajeAEliminar, setMensajeAEliminar] = useState(null)

  const cargar = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const respuestas = await Promise.all(
        ['/Mensajes', '/Plantillas', '/Clientas'].map((p) => request(p))
      )
      if (respuestas.some((r) => !r.ok)) throw new Error('No se pudieron cargar los mensajes')
      const [m, p, c] = await Promise.all(respuestas.map((r) => r.json()))
      setMensajes(m)
      setPlantillas(p)
      setClientas(c)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [request])

  useEffect(() => {
    cargar()
  }, [cargar])

  const plantillaPorId = useMemo(() => new Map(plantillas.map((p) => [p.id, p])), [plantillas])
  const clientaPorId = useMemo(() => new Map(clientas.map((c) => [c.id, c])), [clientas])

  const conteo = (estado) => mensajes.filter((m) => m.estado === estado).length

  // Si filtras por "Fallidos" se muestran todos, sin importar si son próximos o anteriores,
  // para que ninguno se te escape.
  const grupos = useMemo(() => {
    const hoy = startOfDay(new Date())
    const ignorarVista = filtro === 'FALLIDO'
    const proximos = vista === 'proximos' && !ignorarVista

    const lista = mensajes
      .filter((m) => !filtro || m.estado === filtro)
      .filter((m) => {
        if (ignorarVista) return true
        const f = parseISO(m.fechaProgramada)
        return vista === 'proximos' ? f >= hoy : f < hoy
      })
      .sort((a, b) => {
        const diff = parseISO(a.fechaProgramada) - parseISO(b.fechaProgramada)
        return proximos ? diff : -diff
      })

    const mapa = new Map()
    lista.forEach((m) => {
      const k = format(parseISO(m.fechaProgramada), 'yyyy-MM-dd')
      if (!mapa.has(k)) mapa.set(k, [])
      mapa.get(k).push(m)
    })
    return [...mapa.entries()]
  }, [mensajes, vista, filtro])

  const handleReintentar = async (mensaje) => {
    try {
      const res = await request(`/Mensajes/id/${mensaje.id}`, {
        method: 'PUT',
        body: JSON.stringify({
          estado: 'PROGRAMADO',
          intentos: (mensaje.intentos || 0) + 1,
          fechaEnvio: null,
        }),
      })
      if (!res.ok) throw new Error('No se pudo reintentar el mensaje')
      cargar()
    } catch (err) {
      setError(err.message)
    }
  }

  const confirmarEliminar = async () => {
    try {
      const res = await request(`/Mensajes/id/${mensajeAEliminar.id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('No se pudo eliminar el mensaje')
      setMensajeAEliminar(null)
      cargar()
    } catch (err) {
      setError(err.message)
      setMensajeAEliminar(null)
    }
  }

  const chips = [
    { value: '', label: `Todos (${mensajes.length})` },
    { value: 'PROGRAMADO', label: `Programados (${conteo('PROGRAMADO')})` },
    { value: 'ENVIADO', label: `Enviados (${conteo('ENVIADO')})` },
    { value: 'FALLIDO', label: `Fallidos (${conteo('FALLIDO')})` },
  ]

  return (
    <div>
      <Titulo>Mensajes</Titulo>

      <div className="mb-4 grid grid-cols-2 rounded-full bg-primary-container p-1">
        {[
          { value: 'proximos', label: 'Próximos' },
          { value: 'anteriores', label: 'Anteriores' },
        ].map((v) => (
          <button
            key={v.value}
            onClick={() => setVista(v.value)}
            className={`h-10 rounded-full text-sm font-semibold transition-colors ${
              vista === v.value ? 'bg-primary text-white' : 'text-primary'
            }`}
          >
            {v.label}
          </button>
        ))}
      </div>

      <div className="-mx-4 mb-4 flex gap-2 overflow-x-auto px-4 pb-1">
        {chips.map((c) => (
          <button
            key={c.value}
            onClick={() => setFiltro(c.value)}
            className={`h-10 shrink-0 rounded-full px-4 text-sm font-semibold ${
              filtro === c.value ? 'bg-primary text-white' : 'bg-primary-container text-primary'
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      {error && <ErrorBanner>{error}</ErrorBanner>}

      {loading ? (
        <Aviso>Cargando...</Aviso>
      ) : grupos.length === 0 ? (
        <Aviso>No hay mensajes en esta vista.</Aviso>
      ) : (
        <div className="space-y-6">
          {grupos.map(([fecha, lista]) => (
            <section key={fecha}>
              <h2 className="mb-2 text-xs font-bold uppercase tracking-wider text-secondary">
                {isToday(parseISO(fecha)) && 'Hoy · '}
                {format(parseISO(fecha), "EEEE d 'de' MMMM", { locale: es })}
              </h2>
              <div className="space-y-3">
                {lista.map((m) => {
                  const estado = ESTADOS[m.estado] ?? ESTADOS.PROGRAMADO
                  const plantilla = plantillaPorId.get(m.idPlantilla)
                  return (
                    <div key={m.id} className={`${CARD} relative overflow-hidden pl-5`}>
                      <span className={`absolute inset-y-0 left-0 w-1 ${estado.acento}`} />
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <p className="font-headline-md text-lg leading-tight">
                            {clientaPorId.get(m.idClienta)?.nombre ?? `Clienta ${m.idClienta}`}
                          </p>
                          <p className="text-sm text-secondary">
                            {plantilla ? TIPOS_PLANTILLA[plantilla.tipo] ?? plantilla.tipo : 'Plantilla desconocida'}
                            {' · '}
                            {format(parseISO(m.fechaProgramada), 'HH:mm')}
                          </p>
                        </div>
                        <Chip tono={estado.tono}>{estado.label}</Chip>
                      </div>

                      <p className="mt-1 text-xs text-secondary">
                        Intentos: {m.intentos || 0}
                        {m.idCita && ` · Cita #${m.idCita}`}
                      </p>

                      {puedeModificar && (
                        <div className="mt-2 flex gap-2">
                          {m.estado === 'FALLIDO' && (
                            <button
                              onClick={() => handleReintentar(m)}
                              className="h-10 rounded-full bg-primary-container px-4 text-sm font-semibold text-primary"
                            >
                              Reintentar
                            </button>
                          )}
                          <button
                            onClick={() => setMensajeAEliminar(m)}
                            className="h-10 px-3 text-sm font-semibold text-error"
                          >
                            Eliminar
                          </button>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </section>
          ))}
        </div>
      )}

      {mensajeAEliminar && (
        <ConfirmDialog
          title="¿Eliminar mensaje?"
          message="Esto eliminará el mensaje permanentemente."
          onConfirm={confirmarEliminar}
          onCancel={() => setMensajeAEliminar(null)}
        />
      )}
    </div>
  )
}

export default Mensajes