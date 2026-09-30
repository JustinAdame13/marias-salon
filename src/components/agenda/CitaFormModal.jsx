import { useState, useEffect } from 'react'
import { useAgendaApi } from '../../hooks/useAgendaApi'
import BottomSheet from './BottomSheet'

const ESTADOS_CITA = [
  { value: 'CONFIRMADA', label: 'Confirmada' },
  { value: 'COMPLETADA', label: 'Completada' },
  { value: 'CANCELADA', label: 'Cancelada' },
]

const INPUT =
  'h-12 w-full rounded-xl border border-outline-variant bg-white px-3 text-base text-on-surface focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary-container/60'

const Campo = ({ label, children }) => (
  <label className="flex flex-col gap-1.5">
    <span className="text-[11px] font-semibold uppercase tracking-wider text-secondary">{label}</span>
    {children}
  </label>
)

const CitaFormModal = ({ cita, onClose, onSaved, onDelete }) => {
  const { request } = useAgendaApi()
  const esEdicion = Boolean(cita && cita.id)

  const [form, setForm] = useState({
    idClienta: cita?.idClienta || '',
    idEmpleada: cita?.idEmpleada || '',
    inicio: cita?.inicio || '',
    fin: cita?.fin || '',
    estado: cita?.estado || 'CONFIRMADA',
    notas: cita?.notas || '',
    servicios: cita?.servicios || [],
  })

  const [clientas, setClientas] = useState([])
  const [empleadas, setEmpleadas] = useState([])
  const [servicios, setServicios] = useState([])
  const [cargandoDatos, setCargandoDatos] = useState(true)
  const [error, setError] = useState('')
  const [guardando, setGuardando] = useState(false)

  useEffect(() => {
    Promise.all([request('/Clientas'), request('/Empleadas'), request('/Servicios')])
      .then(([c, e, s]) => {
        if (!c.ok || !e.ok || !s.ok) throw new Error('No se pudieron cargar los datos necesarios')
        return Promise.all([c.json(), e.json(), s.json()])
      })
      .then(([c, e, s]) => {
        setClientas(c)
        setEmpleadas(e)
        setServicios(s)
      })
      .catch((err) => setError(err.message))
      .finally(() => setCargandoDatos(false))
  }, [request])

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const agregarServicio = () => {
    setForm((prev) => ({
      ...prev,
      servicios: [...prev.servicios, { idServicio: '', precioCobrado: '' }],
    }))
  }

  const actualizarServicio = (index, campo, valor) => {
    setForm((prev) => {
      const nuevos = [...prev.servicios]
      nuevos[index] = { ...nuevos[index], [campo]: valor }
      if (campo === 'idServicio') {
        const s = servicios.find((x) => x.id === Number(valor))
        if (s) nuevos[index].precioCobrado = s.precio
      }
      return { ...prev, servicios: nuevos }
    })
  }

  const eliminarServicio = (index) => {
    setForm((prev) => ({ ...prev, servicios: prev.servicios.filter((_, i) => i !== index) }))
  }

  const total = form.servicios.reduce((t, s) => t + (Number(s.precioCobrado) || 0), 0)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!form.idClienta || !form.idEmpleada) {
      setError('Debe seleccionar clienta y empleada')
      return
    }
    if (form.servicios.length === 0 || form.servicios.every((s) => !s.idServicio)) {
      setError('Debe agregar al menos un servicio')
      return
    }

    setGuardando(true)
    const body = {
      idClienta: Number(form.idClienta),
      idEmpleada: Number(form.idEmpleada),
      inicio: form.inicio,
      fin: form.fin,
      estado: form.estado,
      notas: form.notas,
      servicios: form.servicios
        .filter((s) => s.idServicio)
        .map(({ idServicio, precioCobrado }) => ({
          idServicio: Number(idServicio),
          precioCobrado: Number(precioCobrado) || 0,
        }))
        .filter((s) => !isNaN(s.idServicio) && s.idServicio > 0),
    }

    try {
      const res = await request(esEdicion ? `/Citas/id/${cita.id}` : '/Citas', {
        method: esEdicion ? 'PUT' : 'POST',
        body: JSON.stringify(body),
      })
      if (!res.ok) {
        const errData = await res.json().catch(() => null)
        throw new Error(errData?.message || 'No se pudo guardar la cita')
      }
      onSaved()
    } catch (err) {
      setError(err.message)
    } finally {
      setGuardando(false)
    }
  }

  return (
    <BottomSheet title={esEdicion ? 'Editar cita' : 'Nueva cita'} onClose={onClose}>
      <form onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col">
        <div className="flex-1 space-y-4 overflow-y-auto px-4 py-3">
          {cargandoDatos ? (
            <p className="py-6 text-center text-secondary">Cargando datos...</p>
          ) : (
            <>
              <div className="grid gap-4 sm:grid-cols-2">
                <Campo label="Clienta">
                  <select name="idClienta" value={form.idClienta} onChange={handleChange} required className={INPUT}>
                    <option value="">Seleccionar...</option>
                    {clientas.map((c) => (
                      <option key={c.id} value={c.id}>{c.nombre}</option>
                    ))}
                  </select>
                </Campo>
                <Campo label="Empleada">
                  <select name="idEmpleada" value={form.idEmpleada} onChange={handleChange} required className={INPUT}>
                    <option value="">Seleccionar...</option>
                    {empleadas.map((e) => (
                      <option key={e.id} value={e.id}>{e.nombre}</option>
                    ))}
                  </select>
                </Campo>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <Campo label="Inicio">
                  <input type="datetime-local" name="inicio" value={form.inicio} onChange={handleChange} required className={INPUT} />
                </Campo>
                <Campo label="Fin">
                  <input type="datetime-local" name="fin" value={form.fin} onChange={handleChange} required className={INPUT} />
                </Campo>
              </div>

              <Campo label="Estado">
                <select name="estado" value={form.estado} onChange={handleChange} className={INPUT}>
                  {ESTADOS_CITA.map((e) => (
                    <option key={e.value} value={e.value}>{e.label}</option>
                  ))}
                </select>
              </Campo>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-secondary">Servicios</span>
                  <button
                    type="button"
                    onClick={agregarServicio}
                    className="h-9 rounded-full bg-primary-container px-4 text-xs font-bold text-primary"
                  >
                    + Agregar
                  </button>
                </div>

                {form.servicios.length === 0 && (
                  <p className="text-sm text-secondary">No hay servicios agregados</p>
                )}

                {form.servicios.map((s, index) => (
                  <div key={index} className="space-y-2 rounded-xl border border-outline-variant bg-surface-container-low p-3">
                    <select
                      value={s.idServicio}
                      onChange={(e) => actualizarServicio(index, 'idServicio', e.target.value)}
                      className={INPUT}
                    >
                      <option value="">Seleccionar servicio...</option>
                      {servicios.map((x) => (
                        <option key={x.id} value={x.id}>{x.nombre} (${x.precio})</option>
                      ))}
                    </select>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        placeholder="Precio"
                        value={s.precioCobrado}
                        onChange={(e) => actualizarServicio(index, 'precioCobrado', e.target.value)}
                        step="0.01"
                        min="0"
                        className={INPUT}
                      />
                      <button
                        type="button"
                        onClick={() => eliminarServicio(index)}
                        className="h-12 shrink-0 px-3 text-sm font-semibold text-error"
                      >
                        Quitar
                      </button>
                    </div>
                  </div>
                ))}

                {form.servicios.length > 0 && (
                  <p className="text-right text-sm font-semibold text-primary">Total: ${total.toFixed(2)}</p>
                )}
              </div>

              <Campo label="Notas">
                <textarea
                  name="notas"
                  value={form.notas}
                  onChange={handleChange}
                  rows={2}
                  className="w-full resize-none rounded-xl border border-outline-variant bg-white p-3 text-base focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary-container/60"
                />
              </Campo>
            </>
          )}

          {error && <p className="text-sm font-medium text-error">{error}</p>}
        </div>

        <div className="space-y-1 border-t border-outline-variant px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-3">
          <button
            type="submit"
            disabled={guardando || cargandoDatos}
            className="h-12 w-full rounded-xl bg-primary text-base font-semibold text-on-primary active:bg-[#663a40] disabled:opacity-50"
          >
            {guardando ? 'Guardando...' : 'Guardar cita'}
          </button>
          {onDelete && (
            <button type="button" onClick={onDelete} className="h-11 w-full text-sm font-semibold text-error">
              Eliminar cita
            </button>
          )}
        </div>
      </form>
    </BottomSheet>
  )
}

export default CitaFormModal