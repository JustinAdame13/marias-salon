import { useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useWhatsApp } from '../context/WhatsAppContext'
import { ChevronIcon, ClockIcon, SparkleIcon, WhatsAppIcon } from './icons'

const serviceCategories = [
  {
    id: 'hair-cuts',
    title: 'Cortes',
    services: [
      {
        name: 'Corte de Dama',
        price: '$250',
        description: 'Corte personalizado según la forma de tu rostro, textura y estilo de vida.',
        duration: '45 min aprox.',
        includes: 'Incluye lavado y peinado básico',
      },
      {
        name: 'Corte de Caballero',
        price: '$150',
        description: 'Corte clásico o moderno con acabado preciso en máquina y tijera.',
        duration: '30 min aprox.',
        includes: '',
      },
      {
        name: 'Corte de Niño',
        price: '$100',
        description: 'Corte cómodo y rápido, ideal para los más pequeños de la casa.',
        duration: '30 min aprox.',
        includes: '',
      },
    ],
  },
  {
    id: 'color',
    title: 'Color & Mechas',
    services: [
      {
        name: 'Aplicación de Tinte (tinte propio)',
        price: '$250',
        description: 'Aplicación profesional usando el tinte que tú traigas.',
        duration: '1 hr aprox.',
        includes: 'Solo mano de obra, no incluye producto ni estilizado',
      },
      {
        name: 'Tinte Global (c. corto)',
        price: '$500+',
        description: 'Color uniforme de raíz a puntas para renovar completamente tu tono.',
        duration: '1.5–2 hrs aprox.',
        includes: 'Incluye producto, lavado y secado',
      },
      {
        name: 'Retoque de Raíz (hasta 1.5 cm)',
        price: '$350',
        description: 'Cubre el crecimiento natural manteniendo el tono uniforme.',
        duration: '1 hr aprox.',
        includes: 'Incluye producto y lavado',
      },
      {
        name: 'Mechas y Rayos (c. corto)',
        price: '$700+',
        description: 'Iluminación parcial con papel o gorro para dar dimensión al cabello.',
        duration: '2–2.5 hrs aprox.',
        includes: 'Incluye matizado, lavado y secado',
      },
      {
        name: 'Balayage y Babylight',
        price: '$1000+',
        description: 'Técnica de iluminación a mano alzada para un efecto natural y degradado.',
        duration: '3–4 hrs aprox.',
        includes: 'Incluye matizado, tratamiento post-color, lavado y secado',
      },
    ],
  },
  {
    id: 'treatments',
    title: 'Tratamientos & Peinados',
    services: [
      {
        name: 'Tratamiento Extrahidratación',
        price: '$500+',
        description: 'Restaura la hidratación y brillo del cabello dañado o reseco.',
        duration: '45–60 min aprox.',
        includes: 'producto sellado con calor',
      },
      {
        name: 'Estilizado de Cabello',
        price: '$150',
        description: 'Peinado con secadora y cepillo para un acabado liso y con movimiento.',
        duration: '30–40 min aprox.',
        includes: '',
      },
      {
        name: 'Planchado',
        price: '$200',
        description: 'Alisado temporal con plancha para un look liso y pulido.',
        duration: '30–45 min aprox.',
        includes: 'Incluye protector térmico',
      },
      {
        name: 'Ondas o Rulos',
        price: '$300',
        description: 'Peinado con ondas suaves o rizos definidos, según tu preferencia.',
        duration: '45 min aprox.',
        includes: 'Incluye fijador y protector termico',
      },
      {
        name: 'Peinado Elaborado',
        price: '$400',
        description: 'Peinado de evento con recogido y detalles personalizados.',
        duration: '1–1.5 hrs aprox.',
        includes: '',
      },
      {
        name: 'Maquillaje Social + Peinado',
        price: '$1,000',
        description: 'Paquete completo de maquillaje de evento y peinado a juego.',
        duration: '2 hrs aprox.',
        includes: 'Incluye pestañas postizas y sellador de maquillaje',
      },
      {
        name: 'Maquillaje Social',
        price: '$800',
        description: 'Maquillaje profesional para fiestas, eventos o sesiones fotográficas.',
        duration: '1–1.5 hrs aprox.',
        includes: 'Incluye pestañas postizas',
      },
    ],
  },
  {
    id: 'lashes-brows',
    title: 'Cejas & Pestañas',
    services: [
      {
        name: 'Laminado y Perfilación de Ceja',
        price: '$250',
        description: 'Cejas peinadas con direccion para un efecto voluminoso y prolijo.',
        duration: '40 min aprox.',
        includes: 'Incluye depilación',
      },
      {
        name: 'Henna de Ceja',
        price: '$200',
        description: 'Henna semipermanente para definir y oscurecer la ceja.',
        duration: '30 min aprox.',
        includes: 'Dura entre 2–3 semanas',
      },
      {
        name: 'Henna + Laminado + Perfilación',
        price: '$350',
        description: 'Combo completo de Henna, laminado y perfilación en una sola cita.',
        duration: '1 hr aprox.',
        includes: 'Incluye depilación',
      },
      {
        name: 'Retiro de Pestañas Postizas',
        price: '$100',
        description: 'Remoción segura de extensiones de pestañas sin dañar la pestaña natural.',
        duration: '20–30 min aprox.',
        includes: 'Incluye limpieza posterior',
      },
      {
        name: 'Pestañas Clásicas (pelo a pelo)',
        price: '$400',
        description: 'Una extensión por cada pestaña natural, efecto natural y elegante.',
        duration: '1.5 hrs aprox.',
        includes: 'Duración aprox. 3 semanas',
      },
      {
        name: 'Pestañas Híbridas',
        price: '$450',
        description: 'Mezcla de técnica clásica y volumen para un efecto más tupido.',
        duration: '1.5–2 hrs aprox.',
        includes: 'Duración aprox. 3 semanas',
      },
      {
        name: 'Pestañas Hawaianas',
        price: '$400',
        description: 'Estilo de volumen con curvatura pronunciada para mirada dramática.',
        duration: '1.5–2 hrs aprox.',
        includes: 'Duración aprox. 3 semanas',
      },
      {
        name: 'Pestañas Griego',
        price: '$450',
        description: 'Efecto de volumen natural que combina densidad en las esquinas.',
        duration: '1.5–2 hrs aprox.',
        includes: 'Duración aprox. 3 semanas',
      },
      {
        name: 'Volumen Tecno 5D/6D',
        price: '$550',
        description: 'Múltiples extensiones por pestaña natural para máximo volumen.',
        duration: '2–2.5 hrs aprox.',
        includes: 'Duración aprox. 3–4 semanas',
      },
      {
        name: 'Retoque de pestañas',
        price: '$300',
        description: '',
        duration: '1 hrs aprox.',
        includes: 'Duración aprox. 3 semanas',
      },
    ],
  },
  {
    id: 'nails-hands',
    title: 'Uñas de Manos',
    services: [
      {
        name: 'Acrílico',
        price: '$280',
        description: 'Uñas esculpidas con acrílico, resistentes y de acabado duradero.',
        duration: '1.5 hrs aprox.',
        includes: 'Incluye esmaltado semipermanente',
      },
      //aqui faltan detalles
      {
        name: 'SoftGel',
        price: '$280',
        description: '',
        duration: '1.5 hrs aprox.',
        includes: '',
      },
      {
        name: 'Largo #1',
        price: '$300',
        description: 'Extensión corta, ideal para un look discreto y funcional.',
        duration: '1.5 hrs aprox.',
        includes: 'Incluye esmaltado semipermanente',
      },
      {
        name: 'Largo #2',
        price: '$350',
        description: 'Extensión media-corta con más presencia que el largo #1.',
        duration: '1.5–2 hrs aprox.',
        includes: 'Incluye esmaltado semipermanente',
      },
      {
        name: 'Largo #3',
        price: '$400',
        description: 'Extensión media, equilibrio entre estilo y comodidad diaria.',
        duration: '2 hrs aprox.',
        includes: 'Incluye esmaltado semipermanente',
      },
      {
        name: 'Largo #4',
        price: '$450',
        description: 'Extensión media-larga para un look más llamativo.',
        duration: '2 hrs aprox.',
        includes: 'Incluye esmaltado semipermanente',
      },
      {
        name: 'Largo #5',
        price: '$500',
        description: 'Extensión larga, ideal para diseños elaborados.',
        duration: '2–2.5 hrs aprox.',
        includes: 'Incluye esmaltado semipermanente',
      },
      {
        name: 'Largo #6',
        price: '$550',
        description: 'Extensión extra larga para un estilo dramático y statement.',
        duration: '2.5 hrs aprox.',
        includes: 'Incluye esmaltado semipermanente',
      },
      {
        name: 'Gelish Semipermanente (1-2 colores)',
        price: '$150',
        description: 'Esmaltado de larga duración sobre uña natural, hasta 2 colores.',
        duration: '45 min aprox.',
        includes: 'Duración aprox. 2–3 semanas',
      },
      //aqui faltan detalles
      {
        name: 'Retiro',
        price: '$150',
        description: '',
        duration: '',
        includes: '',
      },
      //aqui faltan detalles
      {
        name: 'Retoque',
        price: '$280',
        description: '',
        duration: '',
        includes: '',
      },
      //aqui faltan detalles
      {
        name: 'Rubber',
        price: '$250',
        description: '',
        duration: '',
        includes: '',
      },
      //aqui faltan detalles
      {
        name: 'Manicura',
        price: '$250',
        description: '',
        duration: '45 min aprox.',
        includes: '',
      },
      
    ],
  },
  {
    id: 'nails-feet',
    title: 'Uñas de Pies',
    services: [
      {
        name: 'Pedicura con Esmaltado',
        price: '$400',
        description: 'Pedicura completa con exfoliación, corte y esmaltado tradicional.',
        duration: '1 hr aprox.',
        includes: 'Incluye masaje relajante',
      },
      {
        name: 'Esmalte Semipermanente',
        price: '$150',
        description: 'Esmaltado de larga duración solo, sin pedicura completa.',
        duration: '30 min aprox.',
        includes: 'Duración aprox. 3 semanas',
      },
      {
        name: 'Acrílico en Pies',
        price: '$200',
        description: 'Uñas esculpidas en acrílico para pies, resistentes y parejas.',
        duration: '1 hr aprox.',
        includes: 'Incluye esmaltado semipermanente',
      },
      {
        name: 'Quitar Producto de Uñas',
        price: '$100',
        description: 'Retiro seguro de acrílico, polygel o gel sin dañar la uña natural.',
        duration: '20–30 min aprox.',
        includes: 'Incluye hidratación posterior',
      },
    ],
  },
]

// Nota: precios en pesos mexicanos MXN
// Los precios con (+) aumentan según largo y volumen del cabello
// El diseño de uñas se cotiza por WhatsApp

const ease = [0.16, 1, 0.3, 1]

// ---------- Una fila de servicio (acordeón) ----------
const ServiceRow = ({ service, isOpen, onToggle, onBook }) => {
  const panelId = `svc-${service.name.replace(/\W+/g, '-').toLowerCase()}`

  return (
    <li className="border-b border-primary/10 last:border-b-0">
      <button
        type="button"
        onClick={() => onToggle(service.name)}
        aria-expanded={isOpen}
        aria-controls={panelId}
        className="flex min-h-14 w-full items-center gap-3 py-3 text-left"
      >
        <span className="flex-1 font-body-md text-[0.95rem] leading-snug text-on-background sm:text-base">
          {service.name}
        </span>
        <span className="shrink-0 rounded-full bg-primary-container/70 px-3 py-1 font-label-md text-sm font-semibold text-on-primary-container">
          {service.price}
        </span>
        <ChevronIcon
          size={18}
          className={`shrink-0 text-on-surface-variant transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            id={panelId}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease }}
            className="overflow-hidden"
          >
            <div className="pb-4">
              <p className="font-body-md text-sm leading-relaxed text-on-surface-variant sm:text-[0.95rem]">
                {service.description}
              </p>
              <div className="mt-3 flex flex-wrap gap-2 font-label-sm text-xs text-on-surface-variant">
                {service.duration && (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-white/70 px-3 py-1">
                    <ClockIcon size={14} /> {service.duration}
                  </span>
                )}
                {service.includes && (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-white/70 px-3 py-1">
                    <SparkleIcon size={14} /> {service.includes}
                  </span>
                )}
              </div>
              <button
                type="button"
                onClick={() => onBook(service)}
                className="mt-4 inline-flex items-center gap-2 rounded-full border border-primary/25 px-4 py-2 font-label-md text-sm font-medium text-primary transition-colors hover:bg-primary hover:text-on-primary"
              >
                <WhatsAppIcon size={16} />
                Agendar este servicio
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </li>
  )
}

// ---------- Sección completa ----------
const Services = () => {
  const { openWhatsApp } = useWhatsApp()
  const [activeId, setActiveId] = useState(serviceCategories[0].id)
  const [openService, setOpenService] = useState(null)
  const tabRefs = useRef({}) // guardamos cada chip para poder centrarlo

  const activeCategory = serviceCategories.find((c) => c.id === activeId)

  const selectCategory = (id) => {
    setActiveId(id)
    setOpenService(null)
    // Centra el chip elegido dentro de la fila deslizable
    tabRefs.current[id]?.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' })
  }

  const handleToggle = (name) => {
    setOpenService((prev) => (prev === name ? null : name))
  }

  const handleBook = (service) => {
    openWhatsApp(
      `Hola 😊 Me gustaría agendar una cita para *${service.name}* en Maria's Beauty Salon. ¿Qué disponibilidad tienen? ✨`
    )
  }

  return (
    <section id="services" className="py-14 sm:py-20">
      <div className="mx-auto max-w-container-max px-4 sm:px-md">

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.8, ease }}
          className="text-center"
        >
          <span className="font-label-md text-xs uppercase tracking-[0.25em] text-gold-ink">
            Menú de servicios
          </span>
          <h2 className="mt-3 font-['Bodoni_Moda'] text-4xl text-on-background sm:text-5xl md:text-6xl">
            Precios <span className="italic text-primary">&amp;</span> servicios
          </h2>
          <div className="mx-auto mt-5 w-24 gold-rule" />
        </motion.div>

        {/* ---------- Pestañas (chips deslizables) ---------- */}
        {/* -mx-4 px-4: el carrusel llega al borde de la pantalla en móvil */}
        <div
          role="tablist"
          aria-label="Categorías de servicios"
          className="no-scrollbar -mx-4 mt-6 -mb-4 flex snap-x gap-2 overflow-x-auto px-4 pt-2 pb-8 sm:mx-0 sm:flex-wrap sm:justify-center sm:px-0"
        >
          {serviceCategories.map((cat) => {
            const selected = cat.id === activeId
            return (
              <button
                key={cat.id}
                ref={(el) => { tabRefs.current[cat.id] = el }}
                type="button"
                role="tab"
                id={`tab-${cat.id}`}
                aria-selected={selected}
                aria-controls="services-panel"
                onClick={() => selectCategory(cat.id)}
                className={`relative isolate shrink-0 snap-center rounded-full px-4 py-2.5 font-label-md text-sm font-medium transition-colors ${
                  selected ? 'text-on-primary' : 'glass text-on-surface-variant hover:text-primary'
                }`}
              >
                {/* layoutId: framer-motion "desliza" la píldora rosa
                    de un chip al otro en lugar de aparecer/desaparecer */}
                {selected && (
                  <motion.span
                    layoutId="active-chip"
                    className="btn-rose absolute inset-0 -z-10 rounded-full"
                    transition={{ type: 'spring', stiffness: 420, damping: 34 }}
                  />
                )}
                {cat.title}
                <span className={`ml-1.5 text-xs ${selected ? 'text-white/75' : 'text-on-surface-variant/70'}`}>
                  {cat.services.length}
                </span>
              </button>
            )
          })}
        </div>

        {/* ---------- Lista de la categoría activa ---------- */}
        <div
          id="services-panel"
          role="tabpanel"
          aria-labelledby={`tab-${activeId}`}
          className="glass relative isolate mx-auto max-w-[48rem] rounded-[1.75rem] px-5 py-2 sm:px-8 sm:py-4"
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={activeId}
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -16 }}
              transition={{ duration: 0.25, ease }}
            >
              <h3 className="pt-3 font-['Bodoni_Moda'] text-2xl text-primary sm:text-3xl">
                {activeCategory.title}
              </h3>
              <ul className="mt-1">
                {activeCategory.services.map((service) => (
                  <ServiceRow
                    key={service.name}
                    service={service}
                    isOpen={openService === service.name}
                    onToggle={handleToggle}
                    onBook={handleBook}
                  />
                ))}
              </ul>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* ---------- Notas ---------- */}
        <div className="mx-auto mt-6 max-w-[48rem] rounded-[1.75rem] border border-gold/30 bg-white/40 p-5 sm:p-6">
          <h4 className="font-label-md text-xs uppercase tracking-[0.25em] text-gold-ink">
            Notas importantes
          </h4>
          <ul className="mt-3 space-y-2 font-body-md text-sm leading-relaxed text-on-surface-variant sm:text-[0.95rem]">
            <li>· Los precios con <strong className="text-primary">+</strong> aumentan según el largo y volumen del cabello.</li>
            <li>· El diseño de uñas se cotiza por WhatsApp; puede tener costo adicional.</li>
            <li>· Para pestañas, acudir <strong className="text-primary">sin maquillaje</strong> a la cita.</li>
            <li>· Atención <strong className="text-primary">exclusiva con cita previa</strong>, una clienta a la vez.</li>
          </ul>
        </div>

        <div className="mt-8 text-center">
          <p className="font-body-md text-sm text-secondary sm:text-base">
            ¿Tienes dudas sobre algún servicio o precio?
          </p>
          <button
            type="button"
            onClick={() => openWhatsApp()}
            className="btn-rose mt-3 inline-flex items-center gap-2 rounded-full px-6 py-3 font-label-md text-sm font-medium transition-transform hover:-translate-y-0.5 active:scale-[0.97]"
          >
            <WhatsAppIcon size={18} />
            Consultar por WhatsApp
          </button>
        </div>
      </div>
    </section>
  )
}

export default Services
