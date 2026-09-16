import { useState } from 'react'
import { useAgendaApi } from '../../hooks/useAgendaApi'

const ClientaFormModal = ({ clienta, onClose, onSaved }) => {
  const { request } = useAgendaApi()
  const esEdicion = Boolean(clienta)

  const [form, setForm] = useState({
    nombre: clienta?.nombre || '',
    telefono: clienta?.telefono || '',
    fechaNacimiento: clienta?.fechaNacimiento || '',
    recordatorios: clienta?.recordatorios ?? true,
    marketing: clienta?.marketing ?? false,
    notas: clienta?.notas || '',
  })
  const [error, setError] = useState('')
  const [guardando, setGuardando] = useState(false)

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setGuardando(true)
    setError('')

    const body = {
      ...form,
      fechaNacimiento: form.fechaNacimiento || null,
    }

    try {
      const path = esEdicion ? `/Clientas/id/${clienta.id}` : '/Clientas/post'
      const res = await request(path, {
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 overflow-y-auto">
      <form
        onSubmit={handleSubmit}
        style={{ width: '90vw', maxWidth: '480px', minWidth: '300px' }}
        className="bg-surface-container-lowest rounded-lg shadow-2xl p-6 flex flex-col gap-4 max-h-[90vh] overflow-y-auto my-auto shrink-0 box-border"
      >
        <h2 className="font-headline-md text-xl font-bold text-primary">
          {esEdicion ? 'Editar clienta' : 'Nueva clienta'}
        </h2>

        <label className="flex flex-col gap-1 text-sm font-medium">
          Nombre
          <input
            name="nombre"
            value={form.nombre}
            onChange={handleChange}
            required
            className="border border-outline-variant rounded-sm p-2 w-full text-base sm:text-sm focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </label>

        <label className="flex flex-col gap-1 text-sm font-medium">
          Teléfono
          <input
            name="telefono"
            value={form.telefono}
            onChange={handleChange}
            required
            placeholder="52XXXXXXXXXX"
            className="border border-outline-variant rounded-sm p-2 w-full text-base sm:text-sm focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </label>

        <label className="flex flex-col gap-1 text-sm font-medium">
          Fecha de nacimiento
          <input
            type="date"
            name="fechaNacimiento"
            value={form.fechaNacimiento}
            onChange={handleChange}
            className="border border-outline-variant rounded-sm p-2 w-full text-base sm:text-sm focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </label>

        <label className="flex items-center gap-2 text-sm select-none cursor-pointer mt-1">
          <input
            type="checkbox"
            name="recordatorios"
            checked={form.recordatorios}
            onChange={handleChange}
            className="h-4 w-4"
          />
          Recibir recordatorios de citas
        </label>

        <label className="flex items-center gap-2 text-sm select-none cursor-pointer">
          <input
            type="checkbox"
            name="marketing"
            checked={form.marketing}
            onChange={handleChange}
            className="h-4 w-4"
          />
          Recibir promociones (marketing)
        </label>

        <label className="flex flex-col gap-1 text-sm font-medium">
          Notas
          <textarea
            name="notas"
            value={form.notas}
            onChange={handleChange}
            rows={3}
            className="border border-outline-variant rounded-sm p-2 w-full text-base sm:text-sm focus:outline-none focus:ring-1 focus:ring-primary resize-none"
          />
        </label>

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

export default ClientaFormModal