import { useState, useEffect, useCallback } from 'react'
import { useAgendaApi } from '../../hooks/useAgendaApi'
import { useAgendaAuth } from '../../context/AgendaAuthContext'
import CitaFormModal from '../../components/agenda/CitaFormModal'
import ConfirmDialog from '../../components/agenda/ConfirmDialog'
import { format, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay, addWeeks, subWeeks, isToday, startOfDay, setHours, setMinutes } from 'date-fns'
import { es } from 'date-fns/locale'

const ESTADOS_CITA = [
  { value: 'CONFIRMADA', label: 'Confirmada' },
  { value: 'COMPLETADA', label: 'Completada' },
  { value: 'CANCELADA', label: 'Cancelada' },
]

const Citas = () => {
  const { request } = useAgendaApi()
  const { user } = useAgendaAuth()
  const puedeModificar = true

  const [citas, setCitas] = useState([])
  const [clientas, setClientas] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [filtroEstado, setFiltroEstado] = useState('')
  const [semanaActual, setSemanaActual] = useState(new Date())
  const [modalOpen, setModalOpen] = useState(false)
  const [citaEditando, setCitaEditando] = useState(null)
  const [citaAEliminar, setCitaAEliminar] = useState(null)

  const cargarCitas = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const [citasRes, clientasRes] = await Promise.all([
        request('/Citas'),
        request('/Clientas')
      ])
      
      if (!citasRes.ok) throw new Error('No se pudieron cargar las citas')
      if (!clientasRes.ok) throw new Error('No se pudieron cargar las clientas')
      
      const todasLasCitas = await citasRes.json()
      const clientasData = await clientasRes.json()
      
      setClientas(clientasData)
      
      let filtradas = todasLasCitas
      if (filtroEstado) {
        filtradas = filtradas.filter(c => c.estado === filtroEstado)
      }
      
      setCitas(filtradas)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [request, filtroEstado])

  useEffect(() => {
    cargarCitas()
  }, [cargarCitas])

  const abrirCrear = (fecha = null, hora = null) => {
    setCitaEditando(fecha ? { 
      inicio: hora ? format(hora, "yyyy-MM-dd'T'HH:mm") : format(fecha, "yyyy-MM-dd'T'09:00"),
      fin: hora ? format(setHours(hora, hora.getHours() + 1), "yyyy-MM-dd'T'HH:mm") : format(fecha, "yyyy-MM-dd'T'10:00")
    } : null)
    setModalOpen(true)
  }

  const abrirEditar = (cita) => {
    setCitaEditando(cita)
    setModalOpen(true)
  }

  const handleGuardado = () => {
    setModalOpen(false)
    cargarCitas()
  }

  const confirmarEliminar = async () => {
    try {
      const res = await request(`/Citas/id/${citaAEliminar.id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('No se pudo eliminar la cita')
      setCitaAEliminar(null)
      cargarCitas()
    } catch (err) {
      setError(err.message)
      setCitaAEliminar(null)
    }
  }

  const getEstadoLabel = (estado) => {
    const estadoInfo = ESTADOS_CITA.find(e => e.value === estado)
    return estadoInfo ? estadoInfo.label : estado
  }

  const getEstadoColor = (estado) => {
    switch (estado) {
      case 'CONFIRMADA':
        return 'bg-primary-container text-on-primary-container border-l-4 border-primary'
      case 'COMPLETADA':
        return 'bg-tertiary-container text-on-tertiary-container border-l-4 border-tertiary'
      case 'CANCELADA':
        return 'bg-error-container text-on-error-container border-l-4 border-error opacity-60'
      default:
        return 'bg-secondary-container text-on-secondary-container'
    }
  }

  const formatearHora = (fechaStr) => {
    if (!fechaStr) return '—'
    const fecha = new Date(fechaStr)
    return format(fecha, 'HH:mm', { locale: es })
  }

  const getNombreClienta = (idClienta) => {
    const clienta = clientas.find(c => c.id === idClienta)
    return clienta ? clienta.nombre : `Clienta ${idClienta}`
  }

  const calcularTotal = (servicios) => {
    if (!servicios || servicios.length === 0) return 0
    return servicios.reduce((total, s) => total + (Number(s.precioCobrado) || 0), 0)
  }

  const diasDeLaSemana = eachDayOfInterval({
    start: startOfWeek(semanaActual, { weekStartsOn: 1 }),
    end: endOfWeek(semanaActual, { weekStartsOn: 1 })
  })

  const horasDelDia = Array.from({ length: 17 }, (_, i) => i + 7) // 7am a 11pm = 7:00 a 23:00

  const obtenerPosicionCita = (cita) => {
    const inicio = new Date(cita.inicio)
    const fin = new Date(cita.fin)
    const horaInicio = inicio.getHours() + inicio.getMinutes() / 60
    const horaFin = fin.getHours() + fin.getMinutes() / 60
    const horaMin = 7 // 7am
    const alturaTotalHoras = 17 // 7am a 11pm = 17 horas
    
    const top = ((horaInicio - horaMin) / alturaTotalHoras) * 100
    const height = Math.max(((horaFin - horaInicio) / alturaTotalHoras) * 100, 5) // Mínimo 5% de altura
    
    return { top, height }
  }

  const getCitasDelDia = (dia) => {
    return citas.filter(cita => {
      const fechaCita = new Date(cita.inicio)
      return isSameDay(fechaCita, dia)
    }).sort((a, b) => new Date(a.inicio) - new Date(b.inicio))
  }

  const handleSemanaAnterior = () => setSemanaActual(subWeeks(semanaActual, 1))
  const handleSemanaSiguiente = () => setSemanaActual(addWeeks(semanaActual, 1))
  const handleHoy = () => setSemanaActual(new Date())

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-sm mb-lg">
        <h1 className="font-headline-md text-xl sm:text-2xl text-primary">Agenda de Citas</h1>
        <div className="flex flex-wrap gap-sm">
          <select
            value={filtroEstado}
            onChange={(e) => setFiltroEstado(e.target.value)}
            className="border border-outline-variant rounded-sm px-md py-sm bg-surface-container-lowest text-xs sm:text-sm"
          >
            <option value="">Todos los estados</option>
            {ESTADOS_CITA.map((e) => (
              <option key={e.value} value={e.value}>{e.label}</option>
            ))}
          </select>
          {puedeModificar && (
            <button
              onClick={() => abrirCrear()}
              className="bg-primary text-on-primary px-lg py-sm rounded-sm font-label-md hover:opacity-90 transition-opacity text-xs sm:text-sm"
            >
              + Nueva cita
            </button>
          )}
        </div>
      </div>

      {error && (
        <div className="bg-error-container text-on-error-container px-md py-sm rounded-sm mb-md text-sm">
          {error}
        </div>
      )}

      <div className="bg-surface-container-lowest rounded-lg border border-outline-variant/20 p-2 sm:p-4 overflow-x-auto">
        {/* Header de la semana */}
        <div className="flex items-center justify-between mb-4 min-w-max">
          <button
            onClick={handleSemanaAnterior}
            className="p-2 hover:bg-surface-container rounded-sm transition-colors"
          >
            ←
          </button>
          <div className="flex items-center gap-2">
            <h2 className="font-headline-md text-base sm:text-lg text-primary">
              {format(startOfWeek(semanaActual, { weekStartsOn: 1 }), 'd MMM', { locale: es })} - {format(endOfWeek(semanaActual, { weekStartsOn: 1 }), 'd MMM yyyy', { locale: es })}
            </h2>
            <button
              onClick={handleHoy}
              className="text-xs sm:text-sm text-secondary hover:text-primary underline"
            >
              Hoy
            </button>
          </div>
          <button
            onClick={handleSemanaSiguiente}
            className="p-2 hover:bg-surface-container rounded-sm transition-colors"
          >
            →
          </button>
        </div>

        {/* Tabla semanal con timeline */}
        <div className="min-w-max">
          {/* Header con días */}
          <div className="grid grid-cols-8 gap-px mb-2">
            <div className="text-xs font-medium text-secondary py-2 text-center border-r border-outline-variant/20">
              Hora
            </div>
            {diasDeLaSemana.map((dia) => {
              const esHoy = isToday(dia)
              return (
                <div
                  key={dia.toISOString()}
                  className={`text-center text-xs sm:text-sm font-medium py-2 border-r border-outline-variant/20 ${
                    esHoy ? 'bg-primary-container text-on-primary-container' : 'bg-surface-container'
                  }`}
                >
                  <div className="hidden sm:block">{format(dia, 'EEE', { locale: es })}</div>
                  <div className="sm:hidden">{format(dia, 'EEE', { locale: es }).slice(0, 3)}</div>
                  <div className="text-xs">{format(dia, 'd')}</div>
                </div>
              )
            })}
          </div>

          {/* Grid de timeline */}
          <div className="grid grid-cols-8 gap-px border-t border-outline-variant/20">
            {/* Columna de horas */}
            <div className="relative" style={{ height: '600px' }}>
              {horasDelDia.map((hora) => (
                <div
                  key={hora}
                  className="absolute w-full text-xs text-secondary text-right pr-2 border-b border-outline-variant/10"
                  style={{ top: `${((hora - 7) / 17) * 100}%` }}
                >
                  {hora}:00
                </div>
              ))}
            </div>

            {/* Columnas de días con timeline */}
            {diasDeLaSemana.map((dia) => {
              const esHoy = isToday(dia)
              const citasDelDia = getCitasDelDia(dia)
              
              return (
                <div
                  key={dia.toISOString()}
                  className={`relative border-r border-outline-variant/20 ${
                    esHoy ? 'bg-primary-container/5' : 'bg-surface-container-low'
                  }`}
                  style={{ height: '600px' }}
                >
                  {/* Líneas de hora */}
                  {horasDelDia.map((hora) => (
                    <div
                      key={hora}
                      className="absolute w-full border-b border-outline-variant/10"
                      style={{ top: `${((hora - 7) / 17) * 100}%` }}
                    />
                  ))}

                  {/* Click para crear cita */}
                  <div
                    onClick={(e) => {
                      const rect = e.currentTarget.getBoundingClientRect()
                      const clickY = e.clientY - rect.top
                      const porcentaje = clickY / rect.height
                      const horaClick = 7 + (porcentaje * 17)
                      const hora = Math.floor(horaClick)
                      const minutos = Math.round((horaClick - hora) * 60)
                      const fechaClick = setHours(setMinutes(startOfDay(dia), minutos), hora)
                      abrirCrear(dia, fechaClick)
                    }}
                    className="absolute inset-0 cursor-crosshair hover:bg-primary/5"
                  />

                  {/* Citas posicionadas */}
                  {citasDelDia.map((cita) => {
                    const { top, height } = obtenerPosicionCita(cita)
                    return (
                      <div
                        key={cita.id}
                        onClick={(e) => { e.stopPropagation(); abrirEditar(cita) }}
                        className={`absolute left-1 right-1 p-1 rounded cursor-pointer overflow-hidden ${getEstadoColor(cita.estado)}`}
                        style={{ top: `${top}%`, height: `${height}%` }}
                        title={`${getNombreClienta(cita.idClienta)}: ${formatearHora(cita.inicio)} - ${formatearHora(cita.fin)}`}
                      >
                        <div className="text-xs font-medium truncate">
                          {getNombreClienta(cita.idClienta)}
                        </div>
                        <div className="text-xs opacity-75 truncate">
                          {formatearHora(cita.inicio)} - {formatearHora(cita.fin)}
                        </div>
                      </div>
                    )
                  })}
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {modalOpen && (
        <CitaFormModal
          cita={citaEditando}
          onClose={() => setModalOpen(false)}
          onSaved={handleGuardado}
        />
      )}

      {citaAEliminar && (
        <ConfirmDialog
          title="¿Eliminar cita?"
          message={`Esto eliminará la cita permanentemente.`}
          onConfirm={confirmarEliminar}
          onCancel={() => setCitaAEliminar(null)}
        />
      )}
    </div>
  )
}

export default Citas
