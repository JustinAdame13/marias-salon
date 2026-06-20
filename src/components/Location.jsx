import { motion } from 'framer-motion'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
import useScrollReveal from '../hooks/useScrollReveal'
import { fadeLeft, fadeRight } from '../animations/variants'

delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

const SALON_POSITION = [25.5515, -103.4115]

const Location = () => {
  const left = useScrollReveal()
  const right = useScrollReveal()

  return (
    <section id="location" className="py-xl bg-surface-container-high">
      <div className="max-w-container-max mx-auto px-md">
        <div className="grid md:grid-cols-2 gap-lg items-center">

          <motion.div
            ref={left.ref}
            variants={fadeLeft}
            initial="hidden"
            animate={left.controls}
          >
            <h2 className="font-headline-lg text-headline-lg text-primary mb-md">
              Ubicación Boutique
            </h2>
            <p className="font-body-lg text-body-lg text-secondary mb-lg">
              Estamos ubicados en el corazón de Torreón, Coahuila.
              Visítanos en una de las zonas más exclusivas y
              seguras de la ciudad.
            </p>

            <div className="flex items-start gap-md mb-base">
              <span className="text-primary text-xl mt-1">📍</span>
              <address className="not-italic font-body-md text-body-md text-on-surface">
                Cesáreo Castro 662, Lucio Blanco<br />
                27230 Torreón, Coahuila
              </address>
            </div>

            <div className="flex items-start gap-md mb-lg">
              <span className="text-primary text-xl mt-1">🕐</span>
              <p className="font-body-md text-body-md text-on-surface">
                Lunes a Domingo: 6:00 AM – 12:00 PM<br />
                <span className="font-label-sm text-label-sm text-primary">Solo con cita previa</span>
              </p>
            </div>

            <a
              href="https://maps.app.goo.gl/CDqp75T3Qs8n8Wco7"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block border border-primary text-primary px-lg py-sm rounded-sm font-label-md hover:bg-primary hover:text-on-primary transition-all"
            >
              Cómo llegar
            </a>
          </motion.div>

          <motion.div
            ref={right.ref}
            variants={fadeRight}
            initial="hidden"
            animate={right.controls}
            className="h-96 md:h-[450px] w-full rounded-sm overflow-hidden shadow-inner z-0"
          >
            <MapContainer
              center={SALON_POSITION}
              zoom={15}
              style={{ height: '100%', width: '100%' }}
              scrollWheelZoom={false}
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
          </motion.div>

        </div>
      </div>
    </section>
  )
}

export default Location