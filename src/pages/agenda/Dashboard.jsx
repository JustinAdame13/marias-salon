import { useState, useEffect, useCallback, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { format, isToday, startOfWeek, endOfWeek, isWithinInterval } from 'date-fns'
import { es } from 'date-fns/locale'
import { useAgendaApi } from '../../hooks/useAgendaApi'
import { useAgendaAuth } from '../../context/AgendaAuthContext'
import { CARD } from '../../components/agenda/estilos'
import { Aviso, Chip, ErrorBanner } from '../../components/agenda/ui'

const ESTADOS = {
  CONFIRMADA: { label: 'Confirmada', tono: 'primary' },
  COMPLETADA: { label: 'Completada', tono: 'sage' },
  CANCELADA: { label: 'Cancelada', tono: 'sand' },
}

const Stat = ({ valor, etiqueta, color = 'text-primary' }) => (
  <div className={CARD}>
    <p className={`text-3xl font-bold ${color}`}>{valor}</p>
    <p className="mt-1 text-xs text-secondary">{etiqueta}</p>
  </div>
)

const AgendaDashboard = () => {
  const { request } = useAgendaApi()
  const { user } = useAgendaAuth()

  const [citas, setCitas] = useState([])
  const [clientas, setClientas] = useState([])
  const [mensajes, setMensajes] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const cargar = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const [citasRes, clientasRes, mensajesRes] = await Promise.all([
        request('/Citas'),
        request('/Clientas'),
        request('/Mensajes'),
      ])
      if (!citasRes.ok || !clientasRes.ok) throw new Error('No se pudieron cargar los datos')
      setCitas(await citasRes.json())
      setClientas(await clientasRes.json())
      // Si el rol no tiene permiso sobre mensajes, simplemente no mostramos esas tarjetas
      setMensajes(mensajesRes.ok ? await mensajesRes.json() : null)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [request])

  useEffect(() => {
    cargar()
  }, [cargar])

  const clientaPorId = useMemo(() => new Map(clientas.map((c) => [c.id, c])), [clientas])

  const { citasHoy, citasSemana } = useMemo(() => {
    const semana = {
      start: startOfWeek(new Date(), { weekStartsOn: 1 }),
      end: endOfWeek(new Date(), { weekStartsOn: 1 }),
    }
    return {
      citasHoy: citas
        .filter((c) => isToday(new Date(c.inicio)))
        .sort((a, b) => new Date(a.inicio) - new Date(b.inicio)),
      citasSemana: citas.filter(
        (c) => c.estado !== 'CANCELADA' && isWithinInterval(new Date(c.inicio), semana)
      ),
    }
  }, [citas])

  const activasHoy = citasHoy.filter((c) => c.estado !== 'CANCELADA').length
  const pendientes = mensajes?.filter((m) => m.estado === 'PROGRAMADO').length ?? 0
  const fallidos = mensajes?.filter((m) => m.estado === 'FALLIDO').length ?? 0

  return (
    <div>
      <div className="mb-5">
        <h1 className="font-headline-md text-2xl text-primary md:text-3xl">Hola, {user?.username}</h1>
        <p className="text-sm capitalize text-secondary">
          {format(new Date(), "EEEE d 'de' MMMM yyyy", { locale: es })}
        </p>
      </div>

      {error && <ErrorBanner>{error}</ErrorBanner>}

      {loading ? (
        <Aviso>Cargando...</Aviso>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4 sm:gap-4">
            <Stat valor={activasHoy} etiqueta="Citas hoy" />
            <Stat valor={citasSemana.length} etiqueta="Esta semana" />
            <Stat valor={clientas.length} etiqueta="Clientas" />
            {mensajes && (
              <Stat
                valor={fallidos > 0 ? fallidos : pendientes}
                etiqueta={fallidos > 0 ? 'Mensajes fallidos' : 'Mensajes pendientes'}
                color={fallidos > 0 ? 'text-error' : 'text-primary'}
              />
            )}
          </div>

          <section>
            <div className="mb-3 flex items-center justify-between">
              <h2 className="font-headline-md text-xl text-primary">Citas de hoy</h2>
              <Link to="/agenda/citas" className="text-sm font-semibold text-primary">
                Ver agenda →
              </Link>
            </div>

            {citasHoy.length === 0 ? (
              <Aviso>No hay citas para hoy</Aviso>
            ) : (
              <div className="space-y-3">
                {citasHoy.map((cita) => {
                  const estado = ESTADOS[cita.estado] ?? ESTADOS.CONFIRMADA
                  return (
                    <Link
                      key={cita.id}
                      to="/agenda/citas"
                      className={`${CARD} flex items-center gap-4 ${cita.estado === 'CANCELADA' ? 'opacity-60' : ''}`}
                    >
                      <div className="text-center leading-tight">
                        <p className="text-base font-bold">{format(new Date(cita.inicio), 'HH:mm')}</p>
                        <p className="text-xs text-secondary">{format(new Date(cita.fin), 'HH:mm')}</p>
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-headline-md text-lg">
                          {clientaPorId.get(cita.idClienta)?.nombre ?? `Clienta ${cita.idClienta}`}
                        </p>
                        <p className="text-xs text-secondary">
                          {cita.servicios?.length || 0} servicio{cita.servicios?.length === 1 ? '' : 's'}
                        </p>
                      </div>
                      <Chip tono={estado.tono}>{estado.label}</Chip>
                    </Link>
                  )
                })}
              </div>
            )}
          </section>
        </div>
      )}
    </div>
  )
}

export default AgendaDashboard