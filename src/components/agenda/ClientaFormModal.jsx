import { useState } from 'react'
import { useAgendaApi } from '../../hooks/useAgendaApi'
import FormSheet from './FormSheet'
import { Campo } from './ui'
import { INPUT, TEXTAREA } from './estilos'

const PREFIJO_TELEFONO = '521'

const ClientaFormModal = ({ clienta, onClose, onSaved, onDelete }) => {
  const { request } = useAgendaApi()
  const esEdicion = Boolean(clienta)

  const [form, setForm] = useState({
    nombre: clienta?.nombre || '',
    telefono: clienta?.telefono?.startsWith(PREFIJO_TELEFONO)
      ? clienta.telefono.slice(PREFIJO_TELEFONO.length)
      : clienta?.telefono || '',
    fechaNacimiento: clienta?.fechaNacimiento || '',
    recordatorios: clienta?.recordatorios ?? true,
    marketing: clienta?.marketing ?? false,
    notas: clienta?.notas || '',
  })
  const [error, setError] = useState('')
  const [guardando, setGuardando] = useState(false)

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    if (name === 'telefono') {
      setForm((prev) => ({ ...prev, telefono: value.replace(/\D/g, '').slice(0, 10) }))
      return
    }
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (form.telefono.length !== 10) {
      setError('El teléfono debe tener 10 dígitos')
      return
    }
    setGuardando(true)

    const body = {
      ...form,
      telefono: `${PREFIJO_TELEFONO}${form.telefono}`,
      fechaNacimiento: form.fechaNacimiento || null,
    }

    try {
      const res = await request(esEdicion ? `/Clientas/id/${clienta.id}` : '/Clientas', {
        method: esEdicion ? 'PUT' : 'POST',
        body: JSON.stringify(body),
      })
      if (!res.ok) {
        const errData = await res.json().catch(() => null)
        throw new Error(errData?.message || 'No se pudo guardar la clienta')
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
      title={esEdicion ? 'Editar clienta' : 'Nueva clienta'}
      onClose={onClose}
      onSubmit={handleSubmit}
      guardando={guardando}
      error={error}
      onDelete={esEdicion ? onDelete : undefined}
      deleteLabel="Eliminar clienta"
    >
      <Campo label="Nombre">
        <input name="nombre" value={form.nombre} onChange={handleChange} required className={INPUT} />
      </Campo>

      <Campo label="Teléfono">
        <div className="flex h-12 items-stretch overflow-hidden rounded-2xl border border-outline-variant bg-white/80 focus-within:border-primary focus-within:ring-4 focus-within:ring-primary-container/60">
          <span className="flex select-none items-center bg-surface-container px-3 text-secondary">
            +{PREFIJO_TELEFONO}
          </span>
          <input
            name="telefono"
            value={form.telefono}
            onChange={handleChange}
            required
            inputMode="numeric"
            placeholder="8713960369"
            className="min-w-0 flex-1 px-3 text-base focus:outline-none"
          />
        </div>
      </Campo>

      <Campo label="Fecha de nacimiento">
        <input type="date" name="fechaNacimiento" value={form.fechaNacimiento} onChange={handleChange} className={INPUT} />
      </Campo>

      <div className="space-y-1">
        <label className="flex h-11 cursor-pointer select-none items-center gap-3 text-base">
          <input type="checkbox" name="recordatorios" checked={form.recordatorios} onChange={handleChange} className="h-5 w-5 accent-primary" />
          Recibir recordatorios de citas
        </label>
        <label className="flex h-11 cursor-pointer select-none items-center gap-3 text-base">
          <input type="checkbox" name="marketing" checked={form.marketing} onChange={handleChange} className="h-5 w-5 accent-primary" />
          Recibir promociones (marketing)
        </label>
      </div>

      <Campo label="Notas">
        <textarea name="notas" value={form.notas} onChange={handleChange} rows={3} className={TEXTAREA} />
      </Campo>
    </FormSheet>
  )
}

export default ClientaFormModal