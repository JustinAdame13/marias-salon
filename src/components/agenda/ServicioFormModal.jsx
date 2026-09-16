import { useState, useEffect } from 'react'
import { useAgendaApi } from '../../hooks/useAgendaApi'

const TIPOS_SERVICIO = [
  { value: 'CORTE', label: 'Corte' },
  { value: 'COLOR', label: 'Color' },
  { value: 'PEINADO_TRATAMIENTO', label: 'Peinado / Tratamiento' },
  { value: 'CEJAS_PESTANAS', label: 'Cejas / Pestañas' },
  { value: 'UNAS_MANOS', label: 'Uñas de Manos' },
  { value: 'UNAS_PIES', label: 'Uñas de Pies' },
]

const ServicioFormModal = ({ servicio, onClose, onSaved }) => {
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
      .then((res) => res.ok ? res.json() : Promise.reject(new Error('No se pudieron cargar las plantillas')))
      .then(setPlantillas)
      .catch((err) => setError(err.message))
      .finally(() => setCargandoPlantillas(false))
  }, [request])

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const toggleplantilla = (id) => {
    setForm((prev) => {
      const yaEsta = prev.idsPlantillas.includes(id)
      return {
        ...prev,
        idsPlantillas: yaEsta
          ? prev.idsPlantillas.filter((p) => p !== id)
          : [...prev.idsPlantillas, id],
      }
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setGuardando(true)
    setError('')

    const body = {
      ...form,
      duracion: Number(form.duracion),
      precio: Number(form.precio),
    }

    try {
      const path = esEdicion ? `/Servicios/id/${servicio.id}` : '/Servicios'
      const res = await request(path, {
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 overflow-y-auto">
      <form
        onSubmit={handleSubmit}
        style={{ width: '90vw', maxWidth: '480px', minWidth: '300px' }}
        className="bg-surface-container-lowest rounded-lg shadow-2xl p-6 flex flex-col gap-4 max-h-[90vh] overflow-y-auto my-auto shrink-0 box-border"
      >
        <h2 className="font-headline-md text-xl font-bold text-primary">
          {esEdicion ? 'Editar servicio' : 'Nuevo servicio'}
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

        <div className="grid grid-cols-2 gap-3">
          <label className="flex flex-col gap-1 text-sm font-medium">
            Duración (min)
            <input
              type="number"
              name="duracion"
              value={form.duracion}
              onChange={handleChange}
              min={1}
              required
              className="border border-outline-variant rounded-sm p-2 w-full text-base sm:text-sm focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </label>

          <label className="flex flex-col gap-1 text-sm font-medium">
            Precio (MXN)
            <input
              type="number"
              name="precio"
              value={form.precio}
              onChange={handleChange}
              min={0}
              step="0.01"
              required
              className="border border-outline-variant rounded-sm p-2 w-full text-base sm:text-sm focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </label>
        </div>

        <label className="flex flex-col gap-1 text-sm font-medium">
          Tipo
          <select
            name="tipo"
            value={form.tipo}
            onChange={handleChange}
            className="border border-outline-variant rounded-sm p-2 w-full text-base sm:text-sm focus:outline-none focus:ring-1 focus:ring-primary bg-surface-container-lowest"
          >
            {TIPOS_SERVICIO.map((t) => (
              <option key={t.value} value={t.value}>{t.label}</option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-1 text-sm font-medium">
          Descripción
          <textarea
            name="descripcion"
            value={form.descripcion}
            onChange={handleChange}
            rows={3}
            className="border border-outline-variant rounded-sm p-2 w-full text-base sm:text-sm focus:outline-none focus:ring-1 focus:ring-primary resize-none"
          />
        </label>

        <div className="flex flex-col gap-1">
          <span className="text-sm font-medium">Mensajes automáticos asociados</span>
          {cargandoPlantillas ? (
            <p className="text-sm text-secondary">Cargando plantillas...</p>
          ) : plantillas.length === 0 ? (
            <p className="text-sm text-secondary">No hay plantillas creadas todavía.</p>
          ) : (
            <div className="flex flex-col gap-1 border border-outline-variant rounded-sm p-2 max-h-32 overflow-y-auto">
              {plantillas.map((p) => (
                <label key={p.id} className="flex items-center gap-2 text-sm select-none cursor-pointer">
                  <input
                    type="checkbox"
                    className="h-4 w-4"
                    checked={form.idsPlantillas.includes(p.id)}
                    onChange={() => toggleplantilla(p.id)}
                  />
                  {p.tipo} — {p.nombreMeta}
                </label>
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

export default ServicioFormModal