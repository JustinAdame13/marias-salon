import { useState } from 'react'
import { useAgendaApi } from '../../hooks/useAgendaApi'
import FormSheet from './FormSheet'
import { Campo } from './ui'
import { INPUT } from './estilos'

const TIPOS_PLANTILLA = [
  { value: 'RECORDATORIO', label: 'Recordatorio' },
  { value: 'SEGUIMIENTO', label: 'Seguimiento' },
  { value: 'CUMPLE', label: 'Cumpleaños' },
]

const PlantillaFormModal = ({ plantilla, onClose, onSaved, onDelete }) => {
  const { request } = useAgendaApi()
  const esEdicion = Boolean(plantilla)

  const [form, setForm] = useState({
    tipo: plantilla?.tipo || TIPOS_PLANTILLA[0].value,
    nombreMeta: plantilla?.nombreMeta || '',
    diasOffset: plantilla?.diasOffset ?? '',
    ordenParametros: plantilla?.ordenParametros || [],
    headerImageUrl: plantilla?.headerImageUrl || '',
  })
  const [parametroInput, setParametroInput] = useState('')
  const [imagenRota, setImagenRota] = useState(false)
  const [error, setError] = useState('')
  const [guardando, setGuardando] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    if (name === 'headerImageUrl') setImagenRota(false)
  }

  const agregarParametro = () => {
    const valor = parametroInput.trim()
    if (!valor) return
    setForm((prev) => ({ ...prev, ordenParametros: [...prev.ordenParametros, valor] }))
    setParametroInput('')
  }

  const eliminarParametro = (index) => {
    setForm((prev) => ({
      ...prev,
      ordenParametros: prev.ordenParametros.filter((_, i) => i !== index),
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setGuardando(true)
    setError('')

    // diasOffset = 0 es un valor válido, por eso comparamos contra '' y no contra "falsy"
    const body = {
      ...form,
      diasOffset: form.diasOffset === '' ? null : Number(form.diasOffset),
    }

    try {
      const res = await request(esEdicion ? `/Plantillas/id/${plantilla.id}` : '/Plantillas', {
        method: esEdicion ? 'PUT' : 'POST',
        body: JSON.stringify(body),
      })
      if (!res.ok) {
        const errData = await res.json().catch(() => null)
        throw new Error(errData?.message || 'No se pudo guardar la plantilla')
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
      title={esEdicion ? 'Editar plantilla' : 'Nueva plantilla'}
      onClose={onClose}
      onSubmit={handleSubmit}
      guardando={guardando}
      error={error}
      onDelete={esEdicion ? onDelete : undefined}
      deleteLabel="Eliminar plantilla"
    >
      <Campo label="Tipo">
        <select name="tipo" value={form.tipo} onChange={handleChange} className={INPUT}>
          {TIPOS_PLANTILLA.map((t) => (
            <option key={t.value} value={t.value}>{t.label}</option>
          ))}
        </select>
      </Campo>

      <Campo label="Nombre de la plantilla">
        <input name="nombreMeta" value={form.nombreMeta} onChange={handleChange} required className={INPUT} />
      </Campo>

      <Campo label="Días de offset (opcional)">
        <input type="number" name="diasOffset" value={form.diasOffset} onChange={handleChange} className={INPUT} />
        <span className="text-xs normal-case tracking-normal text-secondary">
          Días antes/después para enviar el mensaje
        </span>
      </Campo>

      <Campo label="URL de imagen del header">
        <input
          type="url"
          name="headerImageUrl"
          value={form.headerImageUrl}
          onChange={handleChange}
          placeholder="https://ejemplo.com/imagen.jpg"
          className={INPUT}
        />
        <span className="text-xs normal-case tracking-normal text-secondary">
          URL pública HTTPS de la imagen para el header de WhatsApp
        </span>
      </Campo>

      {form.headerImageUrl && !imagenRota && (
        <div className="h-32 overflow-hidden rounded-xl border border-outline-variant bg-surface-container-low">
          <img
            src={form.headerImageUrl}
            alt="Vista previa del header"
            className="h-full w-full object-contain"
            onError={() => setImagenRota(true)}
          />
        </div>
      )}

      <div className="space-y-2">
        <span className="text-[11px] font-semibold uppercase tracking-wider text-secondary">Orden de parámetros</span>
        <div className="flex gap-2">
          <input
            type="text"
            value={parametroInput}
            onChange={(e) => setParametroInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault()
                agregarParametro()
              }
            }}
            placeholder="Agregar parámetro..."
            className={INPUT}
          />
          <button
            type="button"
            onClick={agregarParametro}
            aria-label="Agregar parámetro"
            className="btn-rose h-12 w-12 shrink-0 rounded-full text-xl font-semibold"
          >
            +
          </button>
        </div>
        {form.ordenParametros.map((param, index) => (
          <div key={index} className="flex items-center justify-between rounded-xl bg-surface-container-low px-3 py-2 text-sm">
            <span>{index + 1}. {param}</span>
            <button type="button" onClick={() => eliminarParametro(index)} className="h-9 px-2 text-xs font-semibold text-error">
              Quitar
            </button>
          </div>
        ))}
      </div>
    </FormSheet>
  )
}

export default PlantillaFormModal