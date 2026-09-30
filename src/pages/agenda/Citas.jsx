import { useState, useEffect, useCallback, useMemo } from 'react'
import {
  format, startOfWeek, addDays, addWeeks, subWeeks, addMinutes, isSameDay, isToday,
  startOfDay, setHours, setMinutes, differenceInMinutes,
} from 'date-fns'
import { es } from 'date-fns/locale'
import { useAgendaApi } from '../../hooks/useAgendaApi'
import CitaFormModal from '../../components/agenda/CitaFormModal'
import ConfirmDialog from '../../components/agenda/ConfirmDialog'
import Icon from '../../components/agenda/Icon'

const HORA_APERTURA = 9
const HORA_CIERRE = 20
const HUECO_MINIMO = 60
const FMT_INPUT = "yyyy-MM-dd'T'HH:mm"

const ESTADOS = {
  CONFIRMADA: { label: 'Confirmada', chip: 'bg-[#f5eae8] text-[#7d484e]', acento: 'bg-[#7d484e]' },
  COMPLETADA: { label: 'Completada', chip: 'bg-[#e3ebdc] text-[#4d5a34]', acento: 'bg-[#c99a96]' },
  CANCELADA: { label: 'Cancelada', chip: 'bg-[#efe6df] text-[#8c6c70]', acento: 'bg-[#eed9d7]' },
}

const construirLinea = (dia, lista, conHuecos) => {
  const items = lista.map((cita) => ({ tipo: 'cita', cita, inicio: new Date(cita.inicio) }))

  if (conHuecos && dia.getDay() !== 0) {
    const cierre = setMinutes(setHours(startOfDay(dia), HORA_CIERRE), 0)
    let cursor = setMinutes(setHours(startOfDay(dia), HORA_APERTURA), 0)

    lista
      .filter((c) => c.estado !== 'CANCELADA')
      .forEach((cita) => {
        const ini = new Date(cita.inicio)
        const fin = new Date(cita.fin)
        if (differenceInMinutes(ini, cursor) >= HUECO_MINIMO) {
          items.push({ tipo: 'hueco', inicio: cursor, fin: ini })
        }
        if (fin > cursor) cursor = fin
      })

    if (differenceInMinutes(cierre, cursor) >= HUECO_MINIMO) {
      items.push({ tipo: 'hueco', inicio: cursor, fin: cierre })
    }
  }

  return items.sort((a, b) => a.inicio - b.inicio)
}

const BOTON_REDONDO =
  'grid h-11 w-11 shrink-0 place-items-center rounded-full bg-surface-container text-secondary active:bg-surface-container-high'

const HuecoRow = ({ inicio, fin, onClick }) => (
  <div className="grid grid-cols-[3rem_1fr] items-center gap-3 sm:grid-cols-[3.25rem_1fr]">
    <p className="text-right text-sm font-bold text-secondary">{format(inicio, 'HH:mm')}</p>
    <button
      onClick={onClick}
      className="flex items-center justify-between rounded-2xl bg-surface-container px-3 py-2 sm:px-4 sm:py-3 text-left text-secondary"
    >
      <span className="text-xs sm:text-sm">Disponible hasta las {format(fin, 'HH:mm')}</span>
      <span className="grid h-8 w-8 sm:h-9 sm:w-9 place-items-center rounded-full bg-surface-container-high">
        <Icon name="plus" className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
      </span>
    </button>
  </div>
)

const CitaCard = ({ cita, clienta, empleada, servicios, onClick }) => {
  const ini = new Date(cita.inicio)
  const fin = new Date(cita.fin)
  const estado = ESTADOS[cita.estado] ?? ESTADOS.CONFIRMADA
  const total = (cita.servicios ?? []).reduce((t, s) => t + (Number(s.precioCobrado) || 0), 0)
  const telefono = clienta?.telefono
  const detener = (e) => e.stopPropagation()

  return (
    <div className="grid grid-cols-[3rem_1fr] gap-3 sm:grid-cols-[3.25rem_1fr]">
      <div className="pt-3 sm:pt-4 text-right leading-tight">
        <p className="text-sm font-bold">{format(ini, 'HH:mm')}</p>
        <p className="text-xs text-secondary">{differenceInMinutes(fin, ini)}m</p>
      </div>

      <div
        role="button"
        tabIndex={0}
        onClick={onClick}
        onKeyDown={(e) => e.key === 'Enter' && onClick()}
        className={`relative cursor-pointer overflow-hidden rounded-2xl border border-outline-variant bg-white p-3 sm:p-4 pl-4 sm:pl-5 shadow-[0_2px_10px_rgba(125,72,78,0.04)] ${
          cita.estado === 'CANCELADA' ? 'opacity-60' : ''
        }`}
      >
        <span className={`absolute inset-y-0 left-0 w-1 ${estado.acento}`} />

        <div className="flex items-start justify-between gap-2">
          <h3 className="font-headline-md text-base sm:text-lg leading-tight">
            {clienta?.nombre ?? `Clienta ${cita.idClienta}`}
          </h3>
          <span className={`shrink-0 rounded-full px-2 sm:px-3 py-1 text-[9px] sm:text-[10px] font-bold uppercase tracking-wider ${estado.chip}`}>
            {estado.label}
          </span>
        </div>

        <p className="mt-1 text-xs sm:text-sm text-secondary">{servicios || 'Sin servicios'}</p>

        <div className="mt-2 sm:mt-3 flex flex-wrap items-center gap-2 rounded-xl bg-surface-container-low p-2">
          <span className="grid h-7 w-7 sm:h-8 sm:w-8 shrink-0 place-items-center rounded-full bg-primary-container text-[11px] sm:text-xs font-bold text-primary">
            {(empleada?.nombre ?? '?').charAt(0).toUpperCase()}
          </span>
          <p className="min-w-0 flex-1 truncate text-xs sm:text-sm">
            <span className="text-secondary">Por: </span>
            <span className="font-bold">{empleada?.nombre ?? '—'}</span>
          </p>
          {total > 0 && <span className="text-xs sm:text-sm font-semibold text-primary">${total.toFixed(0)}</span>}
          {telefono && (
            <div className="flex items-center gap-2 ml-auto">
              <a
                href={`tel:+${telefono}`}
                onClick={detener}
                aria-label="Llamar"
                className="grid h-9 w-9 sm:h-11 sm:w-11 place-items-center rounded-full bg-surface-container text-secondary"
              >
                <Icon name="phone" className="h-4 w-4 sm:h-5 sm:w-5" />
              </a>
              <a
                href={`https://wa.me/${telefono}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={detener}
                aria-label="Escribir por WhatsApp"
                className="grid h-9 w-9 sm:h-11 sm:w-11 place-items-center rounded-full bg-primary-container text-primary"
              >
                <Icon name="chat" className="h-4 w-4 sm:h-5 sm:w-5" />
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

const Citas = () => {
  const { request } = useAgendaApi()

  const [citas, setCitas] = useState([])
  const [clientas, setClientas] = useState([])
  const [empleadas, setEmpleadas] = useState([])
  const [servicios, setServicios] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [dia, setDia] = useState(() => startOfDay(new Date()))
  const [filtro, setFiltro] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [citaEditando, setCitaEditando] = useState(null)
  const [citaAEliminar, setCitaAEliminar] = useState(null)

  const cargar = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const respuestas = await Promise.all(
        ['/Citas', '/Clientas', '/Empleadas', '/Servicios'].map((p) => request(p))
      )
      if (respuestas.some((r) => !r.ok)) throw new Error('No se pudo cargar la agenda')
      const [c, cl, em, se] = await Promise.all(respuestas.map((r) => r.json()))
      setCitas(c)
      setClientas(cl)
      setEmpleadas(em)
      setServicios(se)
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
  const empleadaPorId = useMemo(() => new Map(empleadas.map((e) => [e.id, e])), [empleadas])
  const servicioPorId = useMemo(() => new Map(servicios.map((s) => [s.id, s])), [servicios])

  const conteoPorDia = useMemo(() => {
    const m = {}
    citas.forEach((c) => {
      if (c.estado === 'CANCELADA') return
      const k = format(new Date(c.inicio), 'yyyy-MM-dd')
      m[k] = (m[k] ?? 0) + 1
    })
    return m
  }, [citas])

  const inicioSemana = startOfWeek(dia, { weekStartsOn: 1 })
  const diasSemana = Array.from({ length: 7 }, (_, i) => addDays(inicioSemana, i))

  const citasDelDia = useMemo(
    () =>
      citas
        .filter((c) => isSameDay(new Date(c.inicio), dia))
        .sort((a, b) => new Date(a.inicio) - new Date(b.inicio)),
    [citas, dia]
  )

  const conteoEstado = (estado) => citasDelDia.filter((c) => c.estado === estado).length
  const citasFiltradas = filtro ? citasDelDia.filter((c) => c.estado === filtro) : citasDelDia
  const linea = construirLinea(dia, citasFiltradas, filtro === '')

  const chips = [
    { value: '', label: `Todas (${citasDelDia.length})` },
    { value: 'CONFIRMADA', label: `Confirmadas (${conteoEstado('CONFIRMADA')})` },
    { value: 'COMPLETADA', label: `Completadas (${conteoEstado('COMPLETADA')})` },
    { value: 'CANCELADA', label: `Canceladas (${conteoEstado('CANCELADA')})` },
  ]

  const abrirCrear = (inicio) => {
    const i = inicio ?? setMinutes(setHours(dia, HORA_APERTURA), 0)
    setCitaEditando({ inicio: format(i, FMT_INPUT), fin: format(addMinutes(i, 60), FMT_INPUT) })
    setModalOpen(true)
  }

  const abrirEditar = (cita) => {
    setCitaEditando(cita)
    setModalOpen(true)
  }

  const handleGuardado = () => {
    setModalOpen(false)
    cargar()
  }

  const pedirEliminar = () => {
    setModalOpen(false)
    setCitaAEliminar(citaEditando)
  }

  const confirmarEliminar = async () => {
    try {
      const res = await request(`/Citas/id/${citaAEliminar.id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('No se pudo eliminar la cita')
      setCitaAEliminar(null)
      cargar()
    } catch (err) {
      setError(err.message)
      setCitaAEliminar(null)
    }
  }

  const nombresServicios = (cita) =>
    (cita.servicios ?? [])
      .map((s) => servicioPorId.get(s.idServicio)?.nombre)
      .filter(Boolean)
      .join(' + ')

  return (
    <div>
      {/* Semana */}
      <div className="mb-4 flex items-center gap-2">
        <button onClick={() => setDia(subWeeks(dia, 1))} aria-label="Semana anterior" className={BOTON_REDONDO}>
          <Icon name="chevronLeft" className="h-5 w-5" />
        </button>
        <h2 className="flex-1 text-center font-headline-md text-base text-primary sm:text-xl">
          {format(inicioSemana, 'd MMM', { locale: es })} – {format(addDays(inicioSemana, 6), 'd MMM yyyy', { locale: es })}
        </h2>
        <button onClick={() => setDia(addWeeks(dia, 1))} aria-label="Semana siguiente" className={BOTON_REDONDO}>
          <Icon name="chevronRight" className="h-5 w-5" />
        </button>
        <button
          onClick={() => setDia(startOfDay(new Date()))}
          className="h-11 rounded-full bg-primary-container px-4 text-xs font-bold tracking-wider text-primary"
        >
          HOY
        </button>
      </div>

      {/* Cinta de días */}
      <div className="mb-4 grid grid-cols-7 gap-1.5 sm:gap-2">
        {diasSemana.map((d) => {
          const activo = isSameDay(d, dia)
          const n = conteoPorDia[format(d, 'yyyy-MM-dd')] ?? 0
          return (
            <button
              key={d.toISOString()}
              onClick={() => setDia(startOfDay(d))}
              className={`flex min-h-[64px] sm:min-h-[76px] flex-col items-center justify-center gap-1 rounded-2xl border transition-colors ${
                activo
                  ? 'border-primary bg-primary text-white shadow-[0_6px_20px_rgba(125,72,78,0.25)]'
                  : `bg-white text-on-surface ${isToday(d) ? 'border-[#c99a96]' : 'border-outline-variant'}`
              }`}
            >
              <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider opacity-80">
                {format(d, 'EEE', { locale: es }).slice(0, 3)}
              </span>
              <span className="text-base sm:text-lg font-semibold leading-none">{format(d, 'd')}</span>
              {n > 0 ? (
                <span className={`min-w-4 sm:min-w-5 rounded-full px-1 sm:px-1.5 text-[9px] sm:text-[10px] font-bold ${activo ? 'bg-white/20' : 'bg-primary-container text-primary'}`}>
                  {n}
                </span>
              ) : (
                <span className="text-[9px] sm:text-[10px] opacity-40">—</span>
              )}
            </button>
          )
        })}
      </div>

      {/* Filtros */}
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

      <p className="mb-3 text-xs font-bold uppercase tracking-wider text-secondary">
        {format(dia, "EEEE d 'de' MMMM", { locale: es })}
      </p>

      {error && (
        <div className="mb-3 rounded-xl bg-error-container px-4 py-3 text-sm text-on-error-container">{error}</div>
      )}

      {/* Línea del día */}
      {loading ? (
        <p className="py-10 text-center text-secondary">Cargando...</p>
      ) : linea.length === 0 ? (
        <div className="py-10 text-center">
          <p className="mb-3 text-secondary">No hay citas este día.</p>
          <button onClick={() => abrirCrear()} className="h-11 rounded-full bg-primary-container px-5 text-sm font-bold text-primary">
            Agendar una cita
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {linea.map((it) =>
            it.tipo === 'hueco' ? (
              <HuecoRow key={`h-${it.inicio.getTime()}`} inicio={it.inicio} fin={it.fin} onClick={() => abrirCrear(it.inicio)} />
            ) : (
              <CitaCard
                key={it.cita.id}
                cita={it.cita}
                clienta={clientaPorId.get(it.cita.idClienta)}
                empleada={empleadaPorId.get(it.cita.idEmpleada)}
                servicios={nombresServicios(it.cita)}
                onClick={() => abrirEditar(it.cita)}
              />
            )
          )}
        </div>
      )}

      {/* Botón flotante */}
      <button
        onClick={() => abrirCrear()}
        className="fixed bottom-[calc(5rem+env(safe-area-inset-bottom))] right-4 z-30 flex h-14 items-center gap-2 rounded-full bg-primary px-6 font-semibold text-on-primary shadow-[0_6px_20px_rgba(125,72,78,0.35)] active:bg-[#663a40] md:bottom-8 md:right-8"
      >
        <Icon name="plus" className="h-5 w-5" />
        Nueva cita
      </button>

      {modalOpen && (
        <CitaFormModal
          cita={citaEditando}
          onClose={() => setModalOpen(false)}
          onSaved={handleGuardado}
          onDelete={citaEditando?.id ? pedirEliminar : undefined}
        />
      )}

      {citaAEliminar && (
        <ConfirmDialog
          title="¿Eliminar cita?"
          message="Esto eliminará la cita permanentemente."
          onConfirm={confirmarEliminar}
          onCancel={() => setCitaAEliminar(null)}
        />
      )}
    </div>
  )
}

export default Citas