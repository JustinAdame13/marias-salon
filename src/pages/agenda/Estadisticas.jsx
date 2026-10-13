import { useState, useEffect, useMemo } from 'react'
import {
  format, subMonths, startOfWeek, startOfMonth, startOfDay,
  eachWeekOfInterval, eachMonthOfInterval, getDay, getHours,
} from 'date-fns'
import { es } from 'date-fns/locale'
import {
  ResponsiveContainer, AreaChart, Area, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, LabelList,
} from 'recharts'
import { useAgendaApi } from '../../hooks/useAgendaApi'
import { CARD, chipFiltro } from '../../components/agenda/estilos'
import { Aviso, ErrorBanner, Titulo } from '../../components/agenda/ui'

/* ------------------------------------------------------------------
   Colores de las gráficas
   - SERIE: un rosa un poquito más saturado que --color-primary.
     El primary (#9c5560) es perfecto para texto, pero como "tinta" de
     una gráfica se lee casi gris; este pasa el chequeo de croma.
   - RAMPA: escala secuencial de un solo tono (claro → oscuro) para el
     mapa de calor: más oscuro = más citas.
------------------------------------------------------------------- */
const SERIE = '#a5505d'
const RAMPA = ['#edd3d3', '#e0b3b6', '#cc8d94', '#b2666f', '#8e4352']
const TINTA_EJES = '#8a7777'
const LINEA_GRID = '#eadcd8'

const RANGOS = [
  { meses: 3, label: '3 meses' },
  { meses: 6, label: '6 meses' },
  { meses: 12, label: '12 meses' },
]

const DIAS = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom']

const moneda = new Intl.NumberFormat('es-MX', {
  style: 'currency', currency: 'MXN', maximumFractionDigits: 0,
})
// Para el eje Y: $0, $500, $1.5k...
const monedaCorta = (v) => (v >= 1000 ? `$${(v / 1000).toFixed(v % 1000 ? 1 : 0)}k` : `$${v}`)

const totalCita = (c) => (c.servicios ?? []).reduce((t, s) => t + (Number(s.precioCobrado) || 0), 0)

// getDay() de date-fns: 0 = domingo. Lo pasamos a 0 = lunes.
const diaLunesPrimero = (fecha) => (getDay(fecha) + 6) % 7

/* ---------------- Piezas pequeñas ---------------- */

const Kpi = ({ valor, etiqueta, nota }) => (
  <div className={CARD}>
    <p className="font-['Bodoni_Moda'] text-3xl leading-none text-on-background sm:text-4xl">{valor}</p>
    <p className="mt-2 text-xs text-secondary">{etiqueta}</p>
    {nota && <p className="mt-0.5 text-[11px] text-on-surface-variant/70">{nota}</p>}
  </div>
)

const Tarjeta = ({ titulo, subtitulo, acciones, children }) => (
  <section className={`${CARD} p-5`}>
    <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
      <div>
        <h2 className="font-['Bodoni_Moda'] text-xl leading-tight text-on-background">{titulo}</h2>
        {subtitulo && <p className="mt-1 text-xs text-secondary">{subtitulo}</p>}
      </div>
      {acciones}
    </div>
    {children}
  </section>
)

// Selector de dos opciones (segmented control)
const Segmentado = ({ opciones, valor, onChange }) => (
  <div className="flex rounded-full bg-surface-container p-0.5">
    {opciones.map((o) => (
      <button
        key={o.value}
        onClick={() => onChange(o.value)}
        className={`h-8 rounded-full px-3 text-xs font-semibold transition-colors ${
          valor === o.value ? 'bg-white text-primary shadow-sm' : 'text-on-surface-variant'
        }`}
      >
        {o.label}
      </button>
    ))}
  </div>
)

// Tooltip de Recharts con el estilo de vidrio de la app.
// Recharts le pasa { active, payload, label } a este componente.
const TooltipVidrio = ({ active, payload, label, formatoValor, formatoLabel }) => {
  if (!active || !payload?.length) return null
  const dato = payload[0]
  return (
    <div className="glass glass-strong rounded-2xl px-3 py-2 text-xs">
      <p className="text-secondary">{formatoLabel ? formatoLabel(label, dato.payload) : label}</p>
      <p className="mt-0.5 flex items-center gap-1.5 font-semibold text-on-background">
        <span className="size-2 rounded-full" style={{ background: SERIE }} />
        {formatoValor(dato.value)}
      </p>
    </div>
  )
}

// Vista de tabla: la misma información sin depender del color ni del mouse
const TablaDatos = ({ columnas, filas }) => (
  <details className="mt-3 text-sm">
    <summary className="cursor-pointer text-xs font-semibold text-primary">Ver como tabla</summary>
    <div className="mt-2 max-h-60 overflow-y-auto rounded-2xl bg-white/60">
      <table className="w-full text-left">
        <thead className="sticky top-0 bg-surface-container-low text-xs text-secondary">
          <tr>{columnas.map((c) => <th key={c} className="px-3 py-2 font-semibold">{c}</th>)}</tr>
        </thead>
        <tbody>
          {filas.map((f, i) => (
            <tr key={i} className="border-t border-outline-variant/60">
              {f.map((celda, j) => (
                <td key={j} className={`px-3 py-1.5 ${j > 0 ? 'tabular-nums' : ''}`}>{celda}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </details>
)

// Etiqueta del eje Y en la gráfica de servicios: corta nombres largos
const TickServicio = ({ x, y, payload }) => {
  const nombre = payload.value.length > 16 ? `${payload.value.slice(0, 15)}…` : payload.value
  return (
    <text x={x - 6} y={y} dy={4} textAnchor="end" fontSize={12} fill="#3d2f30">
      <title>{payload.value}</title>
      {nombre}
    </text>
  )
}

/* ---------------- Página ---------------- */

const Estadisticas = () => {
  const { request } = useAgendaApi()

  const [citas, setCitas] = useState([])
  const [servicios, setServicios] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [meses, setMeses] = useState(3)
  const [metricaServicios, setMetricaServicios] = useState('cantidad')
  const [celda, setCelda] = useState(null)

  // Carga inicial. A diferencia de las otras páginas, aquí NO llamamos
  // setState antes del await (loading ya empieza en true): así el efecto
  // no provoca un render extra y cumple la regla react-hooks/set-state-in-effect.
  // "ignorar" evita guardar datos si el usuario salió antes de que respondiera.
  useEffect(() => {
    let ignorar = false
    Promise.all([request('/Citas'), request('/Servicios')])
      .then(async ([citasRes, serviciosRes]) => {
        if (!citasRes.ok || !serviciosRes.ok) throw new Error('No se pudieron cargar los datos')
        const [c, s] = await Promise.all([citasRes.json(), serviciosRes.json()])
        if (!ignorar) {
          setCitas(c)
          setServicios(s)
        }
      })
      .catch((err) => !ignorar && setError(err.message))
      .finally(() => !ignorar && setLoading(false))
    return () => {
      ignorar = true
    }
  }, [request])

  /* Todo lo que sigue son datos DERIVADOS: no se guardan en estado,
     se calculan con useMemo a partir de citas + filtros. Si cambia
     el rango, React recalcula solo lo necesario. */

  // Citas que cuentan: no canceladas, ya ocurridas y dentro del rango
  const { atendidas, desde } = useMemo(() => {
    const ahora = new Date()
    const desde = startOfDay(subMonths(ahora, meses))
    const atendidas = citas.filter((c) => {
      const ini = new Date(c.inicio)
      return c.estado !== 'CANCELADA' && ini >= desde && ini <= ahora
    })
    return { atendidas, desde }
  }, [citas, meses])

  const kpis = useMemo(() => {
    const ingresos = atendidas.reduce((t, c) => t + totalCita(c), 0)
    return {
      ingresos,
      citas: atendidas.length,
      ticket: atendidas.length ? ingresos / atendidas.length : 0,
    }
  }, [atendidas])

  // 1) Ingresos agrupados por semana (3 meses) o por mes (6/12 meses)
  const porSemana = meses <= 3
  const serieIngresos = useMemo(() => {
    const intervalo = { start: desde, end: new Date() }
    const cubetas = porSemana
      ? eachWeekOfInterval(intervalo, { weekStartsOn: 1 })
      : eachMonthOfInterval(intervalo)
    const clave = (f) =>
      format(porSemana ? startOfWeek(f, { weekStartsOn: 1 }) : startOfMonth(f), 'yyyy-MM-dd')

    const totales = new Map(cubetas.map((f) => [format(f, 'yyyy-MM-dd'), 0]))
    atendidas.forEach((c) => {
      const k = clave(new Date(c.inicio))
      if (totales.has(k)) totales.set(k, totales.get(k) + totalCita(c))
    })
    return cubetas.map((f) => ({
      fecha: f,
      etiqueta: porSemana ? format(f, 'd MMM', { locale: es }) : format(f, 'MMM yy', { locale: es }),
      total: totales.get(format(f, 'yyyy-MM-dd')),
    }))
  }, [atendidas, desde, porSemana])

  // 2) Servicios más vendidos (top 6)
  const topServicios = useMemo(() => {
    const nombrePorId = new Map(servicios.map((s) => [s.id, s.nombre]))
    const acumulado = new Map()
    atendidas.forEach((c) =>
      (c.servicios ?? []).forEach((s) => {
        const actual = acumulado.get(s.idServicio) ?? { cantidad: 0, ingresos: 0 }
        actual.cantidad += 1
        actual.ingresos += Number(s.precioCobrado) || 0
        acumulado.set(s.idServicio, actual)
      })
    )
    return [...acumulado.entries()]
      .map(([id, v]) => ({ nombre: nombrePorId.get(id) ?? `Servicio ${id}`, ...v }))
      .sort((a, b) => b[metricaServicios] - a[metricaServicios])
      .slice(0, 6)
  }, [atendidas, servicios, metricaServicios])

  // 3) Mapa de calor: día de la semana × hora de inicio
  const calor = useMemo(() => {
    const conteo = {}
    let minH = 9
    let maxH = 19
    let usaDomingo = false
    atendidas.forEach((c) => {
      const ini = new Date(c.inicio)
      const d = diaLunesPrimero(ini)
      const h = getHours(ini)
      conteo[`${d}-${h}`] = (conteo[`${d}-${h}`] ?? 0) + 1
      minH = Math.min(minH, h)
      maxH = Math.max(maxH, h)
      if (d === 6) usaDomingo = true
    })
    const horas = Array.from({ length: maxH - minH + 1 }, (_, i) => minH + i)
    const dias = usaDomingo ? DIAS : DIAS.slice(0, 6)
    const max = Math.max(1, ...Object.values(conteo))
    let pico = null
    Object.entries(conteo).forEach(([k, n]) => {
      if (!pico || n > pico.n) pico = { k, n }
    })
    return { conteo, horas, dias, max, pico }
  }, [atendidas])

  const colorCelda = (n) =>
    n === 0 ? 'transparent' : RAMPA[Math.min(RAMPA.length - 1, Math.floor((n / calor.max) * RAMPA.length - 0.0001))]

  const describirCelda = (k) => {
    const [d, h] = k.split('-').map(Number)
    const n = calor.conteo[k] ?? 0
    return `${DIAS[d]} ${String(h).padStart(2, '0')}:00 · ${n} cita${n === 1 ? '' : 's'}`
  }

  const ejeComun = { tickLine: false, axisLine: false, tick: { fontSize: 11, fill: TINTA_EJES } }

  return (
    <div>
      <Titulo>Estadísticas</Titulo>

      {/* Filtro global: una sola fila arriba, afecta a todas las gráficas */}
      <div className="no-scrollbar -mx-4 mb-3 flex gap-2 overflow-x-auto px-4 pb-4 pt-1">
        {RANGOS.map((r) => (
          <button key={r.meses} onClick={() => setMeses(r.meses)} className={chipFiltro(meses === r.meses)}>
            {r.label}
          </button>
        ))}
      </div>

      {error && <ErrorBanner>{error}</ErrorBanner>}

      {loading ? (
        <Aviso>Cargando...</Aviso>
      ) : (
        <div className="space-y-5">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4">
            <div className="col-span-2 sm:col-span-1">
              <Kpi valor={moneda.format(kpis.ingresos)} etiqueta="Ingresos" nota={`Desde ${format(desde, "d 'de' MMM", { locale: es })}`} />
            </div>
            <Kpi valor={kpis.citas} etiqueta="Citas atendidas" />
            <Kpi valor={moneda.format(kpis.ticket)} etiqueta="Ticket promedio" />
          </div>

          {/* ---------- 1. Ingresos en el tiempo ---------- */}
          <Tarjeta
            titulo="Ingresos"
            subtitulo={`Total cobrado por ${porSemana ? 'semana' : 'mes'} · citas no canceladas`}
          >
            {kpis.ingresos === 0 ? (
              <Aviso>Aún no hay ingresos en este periodo.</Aviso>
            ) : (
              <>
                {/* ResponsiveContainer mide a su padre: el padre NECESITA altura */}
                <div className="h-56 sm:h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={serieIngresos} margin={{ top: 8, right: 8, left: -8, bottom: 0 }}>
                      <defs>
                        <linearGradient id="relleno-ingresos" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor={SERIE} stopOpacity={0.22} />
                          <stop offset="100%" stopColor={SERIE} stopOpacity={0.02} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid vertical={false} stroke={LINEA_GRID} />
                      <XAxis dataKey="etiqueta" {...ejeComun} interval="preserveStartEnd" minTickGap={16} />
                      <YAxis {...ejeComun} tickFormatter={monedaCorta} width={48} />
                      <Tooltip
                        cursor={{ stroke: SERIE, strokeOpacity: 0.35, strokeWidth: 1 }}
                        content={
                          <TooltipVidrio
                            formatoValor={moneda.format}
                            formatoLabel={(_, d) =>
                              porSemana
                                ? `Semana del ${format(d.fecha, "d 'de' MMMM", { locale: es })}`
                                : format(d.fecha, 'MMMM yyyy', { locale: es })
                            }
                          />
                        }
                      />
                      <Area
                        type="monotone"
                        dataKey="total"
                        stroke={SERIE}
                        strokeWidth={2}
                        fill="url(#relleno-ingresos)"
                        activeDot={{ r: 5, fill: SERIE, stroke: '#fbf4ef', strokeWidth: 2 }}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
                <TablaDatos
                  columnas={[porSemana ? 'Semana' : 'Mes', 'Ingresos']}
                  filas={serieIngresos.map((d) => [d.etiqueta, moneda.format(d.total)])}
                />
              </>
            )}
          </Tarjeta>

          {/* ---------- 2. Servicios más vendidos ---------- */}
          <Tarjeta
            titulo="Servicios estrella"
            subtitulo={metricaServicios === 'cantidad' ? 'Veces que se realizó cada servicio' : 'Lo que dejó cada servicio'}
            acciones={
              <Segmentado
                valor={metricaServicios}
                onChange={setMetricaServicios}
                opciones={[
                  { value: 'cantidad', label: 'Cantidad' },
                  { value: 'ingresos', label: 'Ingresos' },
                ]}
              />
            }
          >
            {topServicios.length === 0 ? (
              <Aviso>Aún no hay servicios en este periodo.</Aviso>
            ) : (
              <>
                {/* Altura según el número de barras: ~40px por servicio */}
                <div style={{ height: topServicios.length * 40 + 8 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={topServicios}
                      layout="vertical"
                      margin={{ top: 0, right: 56, left: 0, bottom: 0 }}
                      barCategoryGap={10}
                    >
                      <XAxis type="number" hide />
                      <YAxis
                        type="category"
                        dataKey="nombre"
                        width={118}
                        tickLine={false}
                        axisLine={false}
                        tick={<TickServicio />}
                      />
                      <Tooltip
                        cursor={{ fill: '#f3dfe0', fillOpacity: 0.5 }}
                        content={
                          <TooltipVidrio
                            formatoValor={(v) =>
                              metricaServicios === 'cantidad' ? `${v} ${v === 1 ? 'vez' : 'veces'}` : moneda.format(v)
                            }
                          />
                        }
                      />
                      <Bar dataKey={metricaServicios} fill={SERIE} radius={[0, 4, 4, 0]} barSize={18}>
                        <LabelList
                          dataKey={metricaServicios}
                          position="right"
                          formatter={(v) => (metricaServicios === 'cantidad' ? v : monedaCorta(v))}
                          style={{ fontSize: 12, fill: '#3d2f30', fontWeight: 600 }}
                        />
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <TablaDatos
                  columnas={['Servicio', 'Veces', 'Ingresos']}
                  filas={topServicios.map((s) => [s.nombre, s.cantidad, moneda.format(s.ingresos)])}
                />
              </>
            )}
          </Tarjeta>

          {/* ---------- 3. Mapa de calor: días y horarios ---------- */}
          <Tarjeta
            titulo="Días y horarios"
            subtitulo={
              calor.pico
                ? `Lo más ocupado: ${describirCelda(calor.pico.k)}`
                : 'Hora de inicio de las citas'
            }
          >
            {atendidas.length === 0 ? (
              <Aviso>Aún no hay citas en este periodo.</Aviso>
            ) : (
              <>
                {/* Recharts no trae mapa de calor, pero es solo una cuadrícula:
                    CSS Grid con una columna para la hora + una por día */}
                <div
                  role="grid"
                  aria-label="Citas por día y hora"
                  className="grid gap-[3px]"
                  style={{ gridTemplateColumns: `2.6rem repeat(${calor.dias.length}, minmax(0, 1fr))` }}
                >
                  <span />
                  {calor.dias.map((d) => (
                    <span key={d} className="pb-1 text-center text-[11px] font-semibold text-secondary">{d}</span>
                  ))}

                  {calor.horas.map((h) => (
                    <div key={h} role="row" className="contents">
                      <span className="pr-1 text-right text-[11px] leading-7 tabular-nums text-on-surface-variant/80">
                        {String(h).padStart(2, '0')}:00
                      </span>
                      {calor.dias.map((_, d) => {
                        const k = `${d}-${h}`
                        const n = calor.conteo[k] ?? 0
                        const activa = celda === k
                        return (
                          <button
                            key={k}
                            role="gridcell"
                            title={describirCelda(k)}
                            aria-label={describirCelda(k)}
                            onClick={() => setCelda(activa ? null : k)}
                            className={`h-7 rounded-md transition-shadow ${n === 0 ? 'border border-dashed border-outline-variant bg-white/30' : ''} ${
                              activa ? 'ring-2 ring-on-background ring-offset-1 ring-offset-[#fbf4ef]' : ''
                            }`}
                            style={n ? { background: colorCelda(n) } : undefined}
                          />
                        )
                      })}
                    </div>
                  ))}
                </div>

                <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
                  <p className="min-h-4 text-xs font-semibold text-on-background" aria-live="polite">
                    {celda ? describirCelda(celda) : 'Toca un cuadro para ver el detalle'}
                  </p>
                  {/* Leyenda de la escala */}
                  <div className="flex items-center gap-1.5 text-[11px] text-secondary">
                    Menos
                    <span className="size-3 rounded-[3px] border border-dashed border-outline-variant bg-white/30" title="Sin citas" />
                    {RAMPA.map((c) => <span key={c} className="size-3 rounded-[3px]" style={{ background: c }} />)}
                    Más
                  </div>
                </div>
              </>
            )}
          </Tarjeta>
        </div>
      )}
    </div>
  )
}

export default Estadisticas
