import { motion } from 'framer-motion'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
import { useWhatsApp } from '../context/WhatsAppContext'
import { ClockIcon, NavigateIcon, PinIcon, WhatsAppIcon } from './icons'

delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

const SALON_POSITION = [25.534904618690064, -103.43291930247389]
const MAPS_URL = 'https://maps.app.goo.gl/CDqp75T3Qs8n8Wco7'
const ease = [0.16, 1, 0.3, 1]

const InfoRow = ({ icon, children }) => (
  <div className="flex items-start gap-3">
    <span className="grid size-10 shrink-0 place-items-center rounded-full bg-primary-container/70 text-primary">
      {icon}
    </span>
    <div className="pt-1 font-body-md text-[0.95rem] leading-snug text-on-background">{children}</div>
  </div>
)

const Location = () => {
  const { openWhatsApp } = useWhatsApp()

  return (
    <section id="location" className="py-14 sm:py-20">
      <div className="mx-auto max-w-container-max px-4 sm:px-md">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, ease }}
          className="mb-8 text-center md:text-left"
        >
          <span className="font-label-md text-xs uppercase tracking-[0.25em] text-gold-ink">
            Visítanos
          </span>
          <h2 className="mt-3 font-['Bodoni_Moda'] text-4xl text-on-background sm:text-5xl">
            Ubicación <span className="italic text-primary">boutique</span>
          </h2>
          <p className="mt-3 font-body-md text-base text-secondary">
            En el corazón de Torreón, Coahuila.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.8, ease, delay: 0.1 }}
          className="grid gap-4 md:grid-cols-[1fr_1.4fr] md:items-stretch md:gap-6"
        >
          {/* Tarjeta de información — en móvil va DESPUÉS del mapa */}
          <div className="glass order-2 flex flex-col gap-5 rounded-[1.75rem] p-5 sm:p-7 md:order-1">
            <InfoRow icon={<PinIcon size={20} />}>
              <address className="not-italic">
                Cesáreo Castro 662, Lucio Blanco<br />
                27230 Torreón, Coahuila
              </address>
            </InfoRow>
            <InfoRow icon={<ClockIcon size={20} />}>
              Lunes a sábado · 9:00 a 20:00
              <span className="mt-1 block font-label-sm text-xs text-primary">
                Solo con cita previa · fuera de horario con costo extra
              </span>
            </InfoRow>

            <div className="mt-auto flex flex-col gap-3 pt-2 sm:flex-row md:flex-col lg:flex-row">
              <a
                href={MAPS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-rose inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-full px-5 font-label-md text-sm font-medium transition-transform active:scale-[0.97]"
              >
                <NavigateIcon size={18} />
                Cómo llegar
              </a>
              <button
                type="button"
                onClick={() => openWhatsApp()}
                className="inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-full border border-primary/25 bg-white/50 px-5 font-label-md text-sm font-medium text-primary transition-colors hover:bg-white/80"
              >
                <WhatsAppIcon size={18} />
                Agendar cita
              </button>
            </div>
          </div>

          {/* Mapa — "isolate" encierra los z-index altos de Leaflet (400+)
              para que no se monten encima del navbar ni de la barra inferior */}
          <div className="relative isolate order-1 h-72 overflow-hidden rounded-[1.75rem] shadow-[0_24px_50px_-28px_rgb(110_58_66/0.5)] ring-1 ring-white/70 sm:h-96 md:order-2 md:h-auto md:min-h-[26rem]">
            <MapContainer
              center={SALON_POSITION}
              zoom={16}
              style={{ height: '100%', width: '100%' }}
              scrollWheelZoom={false}
              // En celular, arrastrar con un dedo hace scroll de la página
              // en lugar de mover el mapa (evita quedar "atrapado")
              dragging={typeof window !== 'undefined' && !('ontouchstart' in window)}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <Marker position={SALON_POSITION}>
                <Popup>
                  <strong>Maria's Beauty Salon</strong><br />
                  Cesáreo Castro 662, Lucio Blanco<br />
                  27230 Torreón, Coahuila
                </Popup>
              </Marker>
            </MapContainer>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default Location
