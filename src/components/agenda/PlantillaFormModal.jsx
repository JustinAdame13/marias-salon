import { useState, useEffect } from 'react'
import { useAgendaApi } from '../../hooks/useAgendaApi'

const TIPOS_PLANTILLA = [
  { value: 'RECORDATORIO', label: 'Recordatorio' },
  { value: 'SEGUIMIENTO', label: 'Seguimiento' },
  { value: 'CUMPLE', label: 'Cumpleaños' },
]

const PlantillaFormModal = ({ plantilla, onClose, onSaved }) => {
  const { request } = useAgendaApi()
  const esEdicion = Boolean(plantilla)

  const [form, setForm] = useState({
    tipo: plantilla?.tipo || TIPOS_PLANTILLA[0].value,
    nombreMeta: plantilla?.nombreMeta || '',
    diasOffset: plantilla?.diasOffset || '',
    ordenParametros: plantilla?.ordenParametros || [],
  })
  const [parametroInput, setParametroInput] = useState('')
  const [error, setError] = useState('')
  const [guardando, setGuardando] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const agregarParametro = () => {
    if (parametroInput.trim()) {
      setForm((prev) => ({
        ...prev,
        ordenParametros: [...prev.ordenParametros, parametroInput.trim()],
      }))
      setParametroInput('')
    }
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

    const body = {
      ...form,
      diasOffset: form.diasOffset ? Number(form.diasOffset) : null,
    }

    try {
      const path = esEdicion ? `/Plantillas/id/${plantilla.id}` : '/Plantillas'
      const res = await request(path, {
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 overflow-y-auto">
      <form
        onSubmit={handleSubmit}
        style={{ width: '90vw', maxWidth: '480px', minWidth: '300px' }}
        className="bg-surface-container-lowest rounded-lg shadow-2xl p-6 flex flex-col gap-4 max-h-[90vh] overflow-y-auto my-auto shrink-0 box-border"
      >
        <h2 className="font-headline-md text-xl font-bold text-primary">
          {esEdicion ? 'Editar plantilla' : 'Nueva plantilla'}
        </h2>

        <label className="flex flex-col gap-1 text-sm font-medium">
          Tipo
          <select
            name="tipo"
            value={form.tipo}
            onChange={handleChange}
            className="border border-outline-variant rounded-sm p-2 w-full text-base sm:text-sm focus:outline-none focus:ring-1 focus:ring-primary bg-surface-container-lowest"
          >
            {TIPOS_PLANTILLA.map((t) => (
              <option key={t.value} value={t.value}>{t.label}</option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-1 text-sm font-medium">
          Nombre de la plantilla
          <input
            name="nombreMeta"
            value={form.nombreMeta}
            onChange={handleChange}
            required
            className="border border-outline-variant rounded-sm p-2 w-full text-base sm:text-sm focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </label>

        <label className="flex flex-col gap-1 text-sm font-medium">
          Días de offset (opcional)
          <input
            type="number"
            name="diasOffset"
            value={form.diasOffset}
            onChange={handleChange}
            className="border border-outline-variant rounded-sm p-2 w-full text-base sm:text-sm focus:outline-none focus:ring-1 focus:ring-primary"
          />
          <span className="text-xs text-secondary">Días antes/después para enviar el mensaje</span>
        </label>

        <div className="flex flex-col gap-1">
          <span className="text-sm font-medium">Orden de parámetros</span>
          <div className="flex gap-2">
            <input
              type="text"
              value={parametroInput}
              onChange={(e) => setParametroInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), agregarParametro())}
              placeholder="Agregar parámetro..."
              className="flex-1 border border-outline-variant rounded-sm p-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
            />
            <button
              type="button"
              onClick={agregarParametro}
              className="bg-primary text-on-primary px-3 py-2 rounded-sm text-sm hover:opacity-90 transition-opacity"
            >
              +
            </button>
          </div>
          {form.ordenParametros.length > 0 && (
            <div className="flex flex-col gap-1 mt-2">
              {form.ordenParametros.map((param, index) => (
                <div key={index} className="flex items-center justify-between bg-surface-container-low px-2 py-1 rounded-sm text-sm">
                  <span>{index + 1}. {param}</span>
                  <button
                    type="button"
                    onClick={() => eliminarParametro(index)}
                    className="text-error hover:text-error-container text-xs"
                  >
                    Eliminar
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

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
            disabled={guardando}
            className="bg-primary text-on-primary px-5 py-2 rounded-md text-sm font-semibold hover:opacity-90 disabled:opacity-50 transition-opacity cursor-pointer"
          >
            {guardando ? 'Guardando...' : 'Guardar'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default PlantillaFormModal