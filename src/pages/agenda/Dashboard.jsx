import { useState, useEffect, useCallback } from 'react'
import { useAgendaApi } from '../../hooks/useAgendaApi'
import { useAgendaAuth } from '../../context/AgendaAuthContext'
import { format, startOfDay, endOfDay, isToday, startOfWeek, endOfWeek } from 'date-fns'
import { es } from 'date-fns/locale'
import { Link } from 'react-router-dom'

const AgendaDashboard = () => {
  const { request } = useAgendaApi()
  const { user } = useAgendaAuth()
  const puedeModificar = user?.rol === 'ADMIN' || user?.rol === 'JEFA'

  const [stats, setStats] = useState({
    citasHoy: 0,
    citasSemana: 0,
    mensajesPendientes: 0,
    mensajesFallidos: 0,
    clientasTotal: 0,
  })
  const [citasHoy, setCitasHoy] = useState([])
  const [loading, setLoading] = useState(true)

  const cargarDatos = useCallback(async () => {
    setLoading(true)
    try {
      const [citasRes, mensajesRes, clientasRes] = await Promise.all([
        request('/Citas'),
        request('/Mensajes'),
        request('/Clientas')
      ])

      if (!citasRes.ok || !mensajesRes.ok || !clientasRes.ok) {
        throw new Error('Error al cargar datos')
      }

      const todasLasCitas = await citasRes.json()
      const todosLosMensajes = await mensajesRes.json()
      const todasLasClientas = await clientasRes.json()

      const hoy = new Date()
      const inicioSemana = startOfWeek(hoy, { weekStartsOn: 1 })
      const finSemana = endOfWeek(hoy, { weekStartsOn: 1 })

      const citasDelDia = todasLasCitas.filter(c => {
        const fecha = new Date(c.inicio)
        return isToday(fecha)
      })

      const citasDeLaSemana = todasLasCitas.filter(c => {
        const fecha = new Date(c.inicio)
        return fecha >= inicioSemana && fecha <= finSemana
      })

      const mensajesProgramados = todosLosMensajes.filter(m => m.estado === 'PROGRAMADO')
      const mensajesFallidos = todosLosMensajes.filter(m => m.estado === 'FALLIDO')

      setStats({
        citasHoy: citasDelDia.length,
        citasSemana: citasDeLaSemana.length,
        mensajesPendientes: mensajesProgramados.length,
        mensajesFallidos: mensajesFallidos.length,
        clientasTotal: todasLasClientas.length,
      })

      setCitasHoy(citasDelDia.sort((a, b) => new Date(a.inicio) - new Date(b.inicio)))
    } catch (err) {
      console.error('Error cargando dashboard:', err)
    } finally {
      setLoading(false)
    }
  }, [request])

  useEffect(() => {
    cargarDatos()
  }, [cargarDatos])

  const formatearHora = (fechaStr) => {
    if (!fechaStr) return '—'
    const fecha = new Date(fechaStr)
    return format(fecha, 'HH:mm', { locale: es })
  }

  const getEstadoColor = (estado) => {
    switch (estado) {
      case 'CONFIRMADA':
        return 'bg-primary-container text-on-primary-container'
      case 'COMPLETADA':
        return 'bg-tertiary-container text-on-tertiary-container'
      case 'CANCELADA':
        return 'bg-error-container text-on-error-container opacity-60'
      default:
        return 'bg-secondary-container text-on-secondary-container'
    }
  }

  return (
    <div>
      <div className="mb-4 sm:mb-6">
        <h1 className="font-headline-md text-xl sm:text-2xl text-primary mb-2">
          Hola, {user?.username}
        </h1>
        <p className="text-secondary text-xs sm:text-sm">
          {format(new Date(), 'EEEE d MMMM yyyy', { locale: es })}
        </p>
      </div>

      {loading ? (
        <p className="text-secondary">Cargando...</p>
      ) : (
        <div className="space-y-4 sm:space-y-6">
          {/* Tarjetas de estadísticas */}
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-2 sm:gap-4">
            <div className="bg-surface-container-lowest rounded-lg border border-outline-variant/20 p-3 sm:p-4">
              <div className="text-2xl sm:text-3xl font-bold text-primary">{stats.citasHoy}</div>
              <div className="text-xs sm:text-sm text-secondary mt-1">Citas hoy</div>
            </div>
            <div className="bg-surface-container-lowest rounded-lg border border-outline-variant/20 p-3 sm:p-4">
              <div className="text-2xl sm:text-3xl font-bold text-primary">{stats.citasSemana}</div>
              <div className="text-xs sm:text-sm text-secondary mt-1">Esta semana</div>
            </div>
            <div className="bg-surface-container-lowest rounded-lg border border-outline-variant/20 p-3 sm:p-4">
              <div className="text-2xl sm:text-3xl font-bold text-tertiary">{stats.mensajesPendientes}</div>
              <div className="text-xs sm:text-sm text-secondary mt-1">Mensajes pendientes</div>
            </div>
            <div className="bg-surface-container-lowest rounded-lg border border-outline-variant/20 p-3 sm:p-4">
              <div className="text-2xl sm:text-3xl font-bold text-error">{stats.mensajesFallidos}</div>
              <div className="text-xs sm:text-sm text-secondary mt-1">Mensajes fallidos</div>
            </div>
            <div className="bg-surface-container-lowest rounded-lg border border-outline-variant/20 p-3 sm:p-4 col-span-2 lg:col-span-1">
              <div className="text-2xl sm:text-3xl font-bold text-primary">{stats.clientasTotal}</div>
              <div className="text-xs sm:text-sm text-secondary mt-1">Clientas totales</div>
            </div>
          </div>

          {/* Citas de hoy */}
          <div className="bg-surface-container-lowest rounded-lg border border-outline-variant/20 p-3 sm:p-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-headline-md text-base sm:text-lg text-primary">Citas de hoy</h2>
              {puedeModificar && (
                <Link
                  to="/agenda/citas"
                  className="text-xs sm:text-sm text-primary hover:underline"
                >
                  Ver agenda →
                </Link>
              )}
            </div>
            
            {citasHoy.length === 0 ? (
              <p className="text-secondary text-center py-8">No hay citas para hoy</p>
            ) : (
              <div className="space-y-3">
                {citasHoy.map((cita) => (
                  <div
                    key={cita.id}
                    className={`p-3 sm:p-4 rounded-lg ${getEstadoColor(cita.estado)}`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-medium text-xs sm:text-sm">
                          {formatearHora(cita.inicio)} - {formatearHora(cita.fin)}
                        </div>
                        <div className="text-xs text-secondary mt-1">
                          Clienta ID: {cita.idClienta}
                        </div>
                      </div>
                      <div className="text-xs">
                        {cita.servicios?.length || 0} servicio{cita.servicios?.length > 1 ? 's' : ''}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Acciones rápidas */}
          {puedeModificar && (
            <div className="bg-surface-container-lowest rounded-lg border border-outline-variant/20 p-3 sm:p-4">
              <h2 className="font-headline-md text-base sm:text-lg text-primary mb-4">Acciones rápidas</h2>
              <div className="grid grid-cols-2 gap-3">
                <Link
                  to="/agenda/citas"
                  className="bg-primary text-on-primary px-3 sm:px-4 py-3 rounded-sm text-center font-label-md hover:opacity-90 transition-opacity text-xs sm:text-sm"
                >
                  Nueva cita
                </Link>
                <Link
                  to="/agenda/clientas"
                  className="bg-surface-container-high text-on-surface px-3 sm:px-4 py-3 rounded-sm text-center font-label-md hover:opacity-90 transition-opacity text-xs sm:text-sm"
                >
                  Nueva clienta
                </Link>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default AgendaDashboard
