import { useState, useEffect } from 'react'
import { useAgendaApi } from '../../hooks/useAgendaApi'

const ESTADOS_CITA = [
  { value: 'CONFIRMADA', label: 'Confirmada' },
  { value: 'COMPLETADA', label: 'Completada' },
  { value: 'CANCELADA', label: 'Cancelada' },
]

const CitaFormModal = ({ cita, onClose, onSaved }) => {
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

  // Cargar datos necesarios para los selects
  useEffect(() => {
    Promise.all([
      request('/Clientas'),
      request('/Empleadas'),
      request('/Servicios'),
    ])
      .then(([clientasRes, empleadasRes, serviciosRes]) => {
        if (!clientasRes.ok || !empleadasRes.ok || !serviciosRes.ok) {
          throw new Error('No se pudieron cargar los datos necesarios')
        }
        return Promise.all([
          clientasRes.json(),
          empleadasRes.json(),
          serviciosRes.json(),
        ])
      })
      .then(([clientasData, empleadasData, serviciosData]) => {
        setClientas(clientasData)
        setEmpleadas(empleadasData)
        setServicios(serviciosData)
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
      servicios: [...prev.servicios, { idServicio: '', precioCobrado: '', id: undefined }],
    }))
  }

  const actualizarServicio = (index, campo, valor) => {
    setForm((prev) => {
      const nuevosServicios = [...prev.servicios]
      nuevosServicios[index] = { ...nuevosServicios[index], [campo]: valor }
      return { ...prev, servicios: nuevosServicios }
    })
  }

  const eliminarServicio = (index) => {
    setForm((prev) => ({
      ...prev,
      servicios: prev.servicios.filter((_, i) => i !== index),
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setGuardando(true)
    setError('')

    // Validar campos requeridos
    if (!form.idClienta || !form.idEmpleada) {
      setError('Debe seleccionar clienta y empleada')
      setGuardando(false)
      return
    }

    // Validar que haya al menos un servicio
    if (form.servicios.length === 0 || form.servicios.every(s => !s.idServicio)) {
      setError('Debe agregar al menos un servicio')
      setGuardando(false)
      return
    }

    const body = {
      idClienta: Number(form.idClienta),
      idEmpleada: Number(form.idEmpleada),
      inicio: form.inicio,
      fin: form.fin,
      estado: form.estado,
      notas: form.notas,
      servicios: form.servicios
        .filter(s => s.idServicio)
        .map(({ idServicio, precioCobrado }) => ({
          idServicio: Number(idServicio),
          precioCobrado: Number(precioCobrado) || 0,
        }))
        .filter(s => !isNaN(s.idServicio) && s.idServicio > 0),
    }

    try {
      const path = esEdicion && cita.id ? `/Citas/id/${cita.id}` : '/Citas'
      const res = await request(path, {
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

  const getServicioPrecio = (servicioId) => {
    const servicio = servicios.find(s => s.id === Number(servicioId))
    return servicio ? servicio.precio : 0
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-2 sm:p-4 overflow-y-auto">
      <form
        onSubmit={handleSubmit}
        style={{ width: '95vw', maxWidth: '600px', minWidth: '280px' }}
        className="bg-surface-container-lowest rounded-lg shadow-2xl p-4 sm:p-6 flex flex-col gap-4 max-h-[90vh] overflow-y-auto my-auto shrink-0 box-border"
      >
        <h2 className="font-headline-md text-xl font-bold text-primary">
          {esEdicion ? 'Editar cita' : 'Nueva cita'}
        </h2>

        {cargandoDatos ? (
          <p className="text-secondary">Cargando datos...</p>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-3">
              <label className="flex flex-col gap-1 text-sm font-medium">
                Clienta
                <select
                  name="idClienta"
                  value={form.idClienta}
                  onChange={handleChange}
                  required
                  className="border border-outline-variant rounded-sm p-2 w-full text-base sm:text-sm focus:outline-none focus:ring-1 focus:ring-primary bg-surface-container-lowest"
                >
                  <option value="">Seleccionar clienta...</option>
                  {clientas.map((c) => (
                    <option key={c.id} value={c.id}>{c.nombre}</option>
                  ))}
                </select>
              </label>

              <label className="flex flex-col gap-1 text-sm font-medium">
                Empleada
                <select
                  name="idEmpleada"
                  value={form.idEmpleada}
                  onChange={handleChange}
                  required
                  className="border border-outline-variant rounded-sm p-2 w-full text-base sm:text-sm focus:outline-none focus:ring-1 focus:ring-primary bg-surface-container-lowest"
                >
                  <option value="">Seleccionar empleada...</option>
                  {empleadas.map((e) => (
                    <option key={e.id} value={e.id}>{e.nombre}</option>
                  ))}
                </select>
              </label>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <label className="flex flex-col gap-1 text-sm font-medium">
                Inicio
                <input
                  type="datetime-local"
                  name="inicio"
                  value={form.inicio}
                  onChange={handleChange}
                  required
                  className="border border-outline-variant rounded-sm p-2 w-full text-base sm:text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </label>

              <label className="flex flex-col gap-1 text-sm font-medium">
                Fin
                <input
                  type="datetime-local"
                  name="fin"
                  value={form.fin}
                  onChange={handleChange}
                  required
                  className="border border-outline-variant rounded-sm p-2 w-full text-base sm:text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </label>
            </div>

            <label className="flex flex-col gap-1 text-sm font-medium">
              Estado
              <select
                name="estado"
                value={form.estado}
                onChange={handleChange}
                className="border border-outline-variant rounded-sm p-2 w-full text-base sm:text-sm focus:outline-none focus:ring-1 focus:ring-primary bg-surface-container-lowest"
              >
                {ESTADOS_CITA.map((e) => (
                  <option key={e.value} value={e.value}>{e.label}</option>
                ))}
              </select>
            </label>

            <label className="flex flex-col gap-1 text-sm font-medium">
              Notas
              <textarea
                name="notas"
                value={form.notas}
                onChange={handleChange}
                rows={2}
                className="border border-outline-variant rounded-sm p-2 w-full text-base sm:text-sm focus:outline-none focus:ring-1 focus:ring-primary resize-none"
              />
            </label>

            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Servicios</span>
                <button
                  type="button"
                  onClick={agregarServicio}
                  className="text-xs bg-primary text-on-primary px-2 py-1 rounded-sm hover:opacity-90 transition-opacity"
                >
                  + Agregar servicio
                </button>
              </div>
              
              {form.servicios.length === 0 ? (
                <p className="text-sm text-secondary">No hay servicios agregados</p>
              ) : (
                <div className="flex flex-col gap-2">
                  {form.servicios.map((servicio, index) => (
                    <div key={index} className="flex gap-2 items-center">
                      <select
                        value={servicio.idServicio}
                        onChange={(e) => actualizarServicio(index, 'idServicio', e.target.value)}
                        className="flex-1 border border-outline-variant rounded-sm p-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary bg-surface-container-lowest"
                      >
                        <option value="">Seleccionar servicio...</option>
                        {servicios.map((s) => (
                          <option key={s.id} value={s.id}>{s.nombre} (${s.precio})</option>
                        ))}
                      </select>
                      <input
                        type="number"
                        placeholder="Precio"
                        value={servicio.precioCobrado}
                        onChange={(e) => actualizarServicio(index, 'precioCobrado', e.target.value)}
                        step="0.01"
                        min="0"
                        className="w-24 border border-outline-variant rounded-sm p-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                      />
                      <button
                        type="button"
                        onClick={() => eliminarServicio(index)}
                        className="text-error hover:text-error-container text-xs"
                      >
                        Eliminar
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}

        {error && <p className="text-error text-sm font-medium">{error}</p>}

        <div className="flex justify-end gap-3 mt-2 pt-2 border-t border-outline-variant/30">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm text-secondary hover:text-primary transition-colors cursor-pointer"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={guardando || cargandoDatos}
            className="bg-primary text-on-primary px-5 py-2 rounded-md text-sm font-semibold hover:opacity-90 disabled:opacity-50 transition-opacity cursor-pointer"
          >
            {guardando ? 'Guardando...' : 'Guardar'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default CitaFormModal