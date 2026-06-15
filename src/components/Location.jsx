import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import L from 'leaflet'

// Leaflet tiene un bug conocido con bundlers como Vite donde
// los íconos del marcador no cargan correctamente.
// Esta es la solución estándar — le decimos manualmente dónde están los íconos
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

// Coordenadas de Torreón, Coahuila
// Cuando tengas la dirección exacta, ajusta estos números
const SALON_POSITION = [25.5428, -103.4068]

const Location = () => {
  return (
    <section id="location" className="py-xl bg-surface-container-high">
      <div className="max-w-container-max mx-auto px-md">
        <div className="grid md:grid-cols-2 gap-lg items-center">

          {/* Columna izquierda — información */}
          <div>
            <h2 className="font-headline-lg text-headline-lg text-primary mb-md">
              Ubicación Boutique
            </h2>
            <p className="font-body-lg text-body-lg text-secondary mb-lg">
              Estamos ubicados en el corazón de Torreón, Coahuila. 
              Visítanos en una de las zonas más exclusivas y 
              seguras de la ciudad.
            </p>

            {/* Dirección */}
            <div className="flex items-start gap-md mb-base">
              <span className="text-primary text-xl mt-1">📍</span>
              <address className="not-italic font-body-md text-body-md text-on-surface">
                Av. Morelos 1234, Local 5<br />
                Sector Centro, Torreón, Coah. CP 27000
              </address>
            </div>

            {/* Horario */}
            <div className="flex items-start gap-md mb-lg">
              <span className="text-primary text-xl mt-1">🕐</span>
              <p className="font-body-md text-body-md text-on-surface">
                Lunes a Viernes: 10:00 AM – 8:00 PM<br />
                Sábados: 9:00 AM – 6:00 PM
              </p>
            </div>

            <a
              href="https://maps.google.com/?q=Torreon,Coahuila"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block border border-primary text-primary px-lg py-sm rounded-sm font-label-md hover:bg-primary hover:text-on-primary transition-all"
            >
              Cómo llegar
            </a>
          </div>

          {/* Columna derecha — mapa interactivo */}
          <div className="h-96 md:h-[450px] w-full rounded-sm overflow-hidden shadow-inner z-0">
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
                  Av. Morelos 1234, Local 5<br />
                  Torreón, Coahuila
                </Popup>
              </Marker>
            </MapContainer>
          </div>

        </div>
      </div>
    </section>
  )
}

export default Location