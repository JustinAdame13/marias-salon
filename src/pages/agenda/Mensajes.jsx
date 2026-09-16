import { useState, useEffect, useCallback } from 'react'
import { useAgendaApi } from '../../hooks/useAgendaApi'
import { useAgendaAuth } from '../../context/AgendaAuthContext'
import ConfirmDialog from '../../components/agenda/ConfirmDialog'
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, addMonths, subMonths, isToday } from 'date-fns'
import { es } from 'date-fns/locale'

const ESTADOS_MENSAJE = [
  { value: 'PROGRAMADO', label: 'Programado' },
  { value: 'EXITOSO', label: 'Exitoso' },
  { value: 'FALLIDO', label: 'Fallido' },
]

const TIPOS_PLANTILLA = {
  RECORDATORIO: 'Recordatorio',
  SEGUIMIENTO: 'Seguimiento',
  CUMPLE: 'Cumpleaños',
}

const Mensajes = () => {
  const { request } = useAgendaApi()
  const { user } = useAgendaAuth()
  const puedeModificar = user?.rol === 'ADMIN' || user?.rol === 'JEFA'

  const [mensajes, setMensajes] = useState([])
  const [plantillas, setPlantillas] = useState([])
  const [clientas, setClientas] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [filtroEstado, setFiltroEstado] = useState('')
  const [mesActual, setMesActual] = useState(new Date())
  const [mensajeSeleccionado, setMensajeSeleccionado] = useState(null)
  const [mensajeAEliminar, setMensajeAEliminar] = useState(null)

  const cargarDatos = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const [mensajesRes, plantillasRes, clientasRes] = await Promise.all([
        request('/Mensajes'),
        request('/Plantillas'),
        request('/Clientas')
      ])
      
      if (!mensajesRes.ok) throw new Error('No se pudieron cargar los mensajes')
      if (!plantillasRes.ok) throw new Error('No se pudieron cargar las plantillas')
      if (!clientasRes.ok) throw new Error('No se pudieron cargar las clientas')
      
      const todosLosMensajes = await mensajesRes.json()
      const plantillasData = await plantillasRes.json()
      const clientasData = await clientasRes.json()
      
      setPlantillas(plantillasData)
      setClientas(clientasData)
      
      let filtrados = todosLosMensajes
      if (filtroEstado) {
        filtrados = filtrados.filter(m => m.estado === filtroEstado)
      }
      
      setMensajes(filtrados)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [request, filtroEstado])

  useEffect(() => {
    cargarDatos()
  }, [cargarDatos])

  const handleMesAnterior = () => setMesActual(subMonths(mesActual, 1))
  const handleMesSiguiente = () => setMesActual(addMonths(mesActual, 1))
  const handleHoy = () => setMesActual(new Date())

  const getTipoPlantilla = (idPlantilla) => {
    const plantilla = plantillas.find(p => p.id === idPlantilla)
    return plantilla ? TIPOS_PLANTILLA[plantilla.tipo] || plantilla.tipo : 'Desconocido'
  }

  const getNombreClienta = (idClienta) => {
    const clienta = clientas.find(c => c.id === idClienta)
    return clienta ? clienta.nombre : `Clienta ${idClienta}`
  }

  const getEstadoColor = (estado) => {
    switch (estado) {
      case 'PROGRAMADO':
        return 'bg-primary-container text-on-primary-container border-l-4 border-primary'
      case 'EXITOSO':
        return 'bg-tertiary-container text-on-tertiary-container border-l-4 border-tertiary'
      case 'FALLIDO':
        return 'bg-error-container text-on-error-container border-l-4 border-error'
      default:
        return 'bg-secondary-container text-on-secondary-container'
    }
  }

  const handleReintentar = async (mensaje) => {
    try {
      const res = await request(`/Mensajes/id/${mensaje.id}`, {
        method: 'PUT',
        body: JSON.stringify({
          estado: 'PROGRAMADO',
          intentos: (mensaje.intentos || 0) + 1,
          fechaEnvio: null
        })
      })
      if (!res.ok) throw new Error('No se pudo reintentar el mensaje')
      cargarDatos()
    } catch (err) {
      setError(err.message)
    }
  }

  const confirmarEliminar = async () => {
    try {
      const res = await request(`/Mensajes/id/${mensajeAEliminar.id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('No se pudo eliminar el mensaje')
      setMensajeAEliminar(null)
      cargarDatos()
    } catch (err) {
      setError(err.message)
      setMensajeAEliminar(null)
    }
  }

  const diasDelMes = eachDayOfInterval({
    start: startOfMonth(mesActual),
    end: endOfMonth(mesActual)
  })

  const diaInicioMes = startOfMonth(mesActual).getDay()
  const diasRelleno = diaInicioMes === 0 ? 6 : diaInicioMes - 1

  const getMensajesDelDia = (dia) => {
    return mensajes.filter(mensaje => {
      const fechaMensaje = new Date(mensaje.fechaProgramada)
      return isSameDay(fechaMensaje, dia)
    }).sort((a, b) => new Date(a.fechaProgramada) - new Date(b.fechaProgramada))
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-sm mb-lg">
        <h1 className="font-headline-md text-2xl text-primary">Mensajes</h1>
        <div className="flex gap-sm">
          <select
            value={filtroEstado}
            onChange={(e) => setFiltroEstado(e.target.value)}
            className="border border-outline-variant rounded-sm px-md py-sm bg-surface-container-lowest text-sm"
          >
            <option value="">Todos los estados</option>
            {ESTADOS_MENSAJE.map((e) => (
              <option key={e.value} value={e.value}>{e.label}</option>
            ))}
          </select>
        </div>
      </div>

      {error && (
        <div className="bg-error-container text-on-error-container px-md py-sm rounded-sm mb-md text-sm">
          {error}
        </div>
      )}

      <div className="bg-surface-container-lowest rounded-lg border border-outline-variant/20 p-2 sm:p-4">
        {/* Header del calendario */}
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={handleMesAnterior}
            className="p-2 hover:bg-surface-container rounded-sm transition-colors"
          >
            ←
          </button>
          <div className="flex items-center gap-2">
            <h2 className="font-headline-md text-base sm:text-lg text-primary">
              {format(mesActual, 'MMMM yyyy', { locale: es }).toUpperCase()}
            </h2>
            <button
              onClick={handleHoy}
              className="text-xs sm:text-sm text-secondary hover:text-primary underline"
            >
              Hoy
            </button>
          </div>
          <button
            onClick={handleMesSiguiente}
            className="p-2 hover:bg-surface-container rounded-sm transition-colors"
          >
            →
          </button>
        </div>

        {/* Días de la semana */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'].map((dia) => (
            <div key={dia} className="text-center text-xs sm:text-sm font-medium text-secondary py-2">
              {dia}
            </div>
          ))}
        </div>

        {/* Grid del calendario */}
        <div className="grid grid-cols-7 gap-1">
          {/* Días de relleno */}
          {Array.from({ length: diasRelleno }).map((_, i) => (
            <div key={`relleno-${i}`} className="min-h-16 sm:min-h-24 bg-surface-container rounded-sm"></div>
          ))}
          
          {/* Días del mes */}
          {diasDelMes.map((dia) => {
            const mensajesDelDia = getMensajesDelDia(dia)
            const esHoy = isToday(dia)
            
            return (
              <div
                key={dia.toISOString()}
                onClick={() => setMensajeSeleccionado(dia)}
                className={`min-h-16 sm:min-h-24 border border-outline-variant/10 rounded-sm p-1 sm:p-2 cursor-pointer transition-colors hover:border-primary/30 ${
                  esHoy ? 'bg-primary-container/10' : 'bg-surface-container-low'
                }`}
              >
                <div className={`text-xs sm:text-sm font-medium mb-1 ${esHoy ? 'text-primary' : 'text-on-surface'}`}>
                  {format(dia, 'd')}
                </div>
                <div className="space-y-1">
                  {mensajesDelDia.slice(0, 3).map((mensaje) => (
                    <div
                      key={mensaje.id}
                      className={`text-xs p-1 rounded truncate ${getEstadoColor(mensaje.estado)}`}
                    >
                      {getTipoPlantilla(mensaje.idPlantilla)}
                    </div>
                  ))}
                  {mensajesDelDia.length > 3 && (
                    <div className="text-xs text-secondary">
                      +{mensajesDelDia.length - 3} más
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Vista detallada del día seleccionado */}
      {mensajeSeleccionado && (
        <div className="mt-6 bg-surface-container-lowest rounded-lg border border-outline-variant/20 p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-headline-md text-lg text-primary">
              {format(mensajeSeleccionado, 'EEEE d MMMM', { locale: es })}
            </h3>
            <button
              onClick={() => setMensajeSeleccionado(null)}
              className="text-sm text-secondary hover:text-primary underline"
            >
              Cerrar
            </button>
          </div>
          
          {loading ? (
            <p className="text-secondary">Cargando...</p>
          ) : (() => {
            const mensajesDelDia = getMensajesDelDia(mensajeSeleccionado)
            return mensajesDelDia.length === 0 ? (
              <p className="text-secondary text-center py-8">No hay mensajes para este día</p>
            ) : (
              <div className="space-y-3">
                {mensajesDelDia.map((mensaje) => (
                  <div
                    key={mensaje.id}
                    className={`p-4 rounded-lg ${getEstadoColor(mensaje.estado)}`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <div className="font-medium text-sm">
                          {getTipoPlantilla(mensaje.idPlantilla)}
                        </div>
                        <div className="text-xs text-secondary mt-1">
                          {getNombreClienta(mensaje.idClienta)}
                          {mensaje.idCita && ` | Cita ID: ${mensaje.idCita}`}
                        </div>
                        <div className="text-xs text-secondary mt-1">
                          Intentos: {mensaje.intentos || 0}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        {puedeModificar && mensaje.estado === 'FALLIDO' && (
                          <button
                            onClick={() => handleReintentar(mensaje)}
                            className="text-primary hover:underline text-sm"
                          >
                            Reintentar
                          </button>
                        )}
                        {puedeModificar && (
                          <button
                            onClick={() => setMensajeAEliminar(mensaje)}
                            className="text-error hover:underline text-sm"
                          >
                            Eliminar
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )
          })()}
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
