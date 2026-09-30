import { useState, useEffect } from 'react'
import { useAgendaApi } from '../../hooks/useAgendaApi'
import FormSheet from './FormSheet'
import { Campo } from './ui'
import { INPUT, TEXTAREA } from './estilos'

const TIPOS_SERVICIO = [
  { value: 'CORTE', label: 'Corte' },
  { value: 'COLOR', label: 'Color' },
  { value: 'PEINADO_TRATAMIENTO', label: 'Peinado / Tratamiento' },
  { value: 'CEJAS_PESTANAS', label: 'Cejas / Pestañas' },
  { value: 'UNAS_MANOS', label: 'Uñas de Manos' },
  { value: 'UNAS_PIES', label: 'Uñas de Pies' },
]

const ServicioFormModal = ({ servicio, onClose, onSaved, onDelete }) => {
  const { request } = useAgendaApi()
  const esEdicion = Boolean(servicio)

  const [form, setForm] = useState({
    nombre: servicio?.nombre || '',
    duracion: servicio?.duracion || '',
    precio: servicio?.precio || '',
    tipo: servicio?.tipo || TIPOS_SERVICIO[0].value,
    descripcion: servicio?.descripcion || '',
    idsPlantillas: servicio?.idsPlantillas || [],
  })
  const [plantillas, setPlantillas] = useState([])
  const [cargandoPlantillas, setCargandoPlantillas] = useState(true)
  const [error, setError] = useState('')
  const [guardando, setGuardando] = useState(false)

  useEffect(() => {
    request('/Plantillas')
      .then((res) => (res.ok ? res.json() : Promise.reject(new Error('No se pudieron cargar las plantillas'))))
      .then(setPlantillas)
      .catch((err) => setError(err.message))
      .finally(() => setCargandoPlantillas(false))
  }, [request])

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const togglePlantilla = (id) => {
    setForm((prev) => ({
      ...prev,
      idsPlantillas: prev.idsPlantillas.includes(id)
        ? prev.idsPlantillas.filter((p) => p !== id)
        : [...prev.idsPlantillas, id],
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setGuardando(true)
    setError('')

    const body = { ...form, duracion: Number(form.duracion), precio: Number(form.precio) }

    try {
      const res = await request(esEdicion ? `/Servicios/id/${servicio.id}` : '/Servicios', {
        method: esEdicion ? 'PUT' : 'POST',
        body: JSON.stringify(body),
      })
      if (!res.ok) {
        const errData = await res.json().catch(() => null)
        throw new Error(errData?.message || 'No se pudo guardar el servicio')
      }
      onSaved()
    } catch (err) {
      setError(err.message)
    } finally {
      setGuardando(false)
    }
  }

  return (
    <FormSheet
      title={esEdicion ? 'Editar servicio' : 'Nuevo servicio'}
      onClose={onClose}
      onSubmit={handleSubmit}
      guardando={guardando}
      error={error}
      onDelete={esEdicion ? onDelete : undefined}
      deleteLabel="Eliminar servicio"
    >
      <Campo label="Nombre">
        <input name="nombre" value={form.nombre} onChange={handleChange} required className={INPUT} />
      </Campo>

      <div className="grid grid-cols-2 gap-3">
        <Campo label="Duración (min)">
          <input type="number" name="duracion" value={form.duracion} onChange={handleChange} min={1} required inputMode="numeric" className={INPUT} />
        </Campo>
        <Campo label="Precio (MXN)">
          <input type="number" name="precio" value={form.precio} onChange={handleChange} min={0} step="0.01" required inputMode="decimal" className={INPUT} />
        </Campo>
      </div>

      <Campo label="Tipo">
        <select name="tipo" value={form.tipo} onChange={handleChange} className={INPUT}>
          {TIPOS_SERVICIO.map((t) => (
            <option key={t.value} value={t.value}>{t.label}</option>
          ))}
        </select>
      </Campo>

      <Campo label="Descripción">
        <textarea name="descripcion" value={form.descripcion} onChange={handleChange} rows={3} className={TEXTAREA} />
      </Campo>

      <div className="space-y-2">
        <span className="text-[11px] font-semibold uppercase tracking-wider text-secondary">
          Mensajes automáticos asociados
        </span>
        {cargandoPlantillas ? (
          <p className="text-sm text-secondary">Cargando plantillas...</p>
        ) : plantillas.length === 0 ? (
          <p className="text-sm text-secondary">No hay plantillas creadas todavía.</p>
        ) : (
          <div className="max-h-40 overflow-y-auto rounded-xl border border-outline-variant p-1">
            {plantillas.map((p) => (
              <label key={p.id} className="flex min-h-11 cursor-pointer select-none items-center gap-3 rounded-lg px-2 text-sm">
                <input
                  type="checkbox"
                  className="h-5 w-5 accent-primary"
                  checked={form.idsPlantillas.includes(p.id)}
                  onChange={() => togglePlantilla(p.id)}
                />
                {p.tipo} — {p.nombreMeta}
              </label>
            ))}
          </div>
        )}
      </div>
    </FormSheet>
  )
}

export default ServicioFormModal