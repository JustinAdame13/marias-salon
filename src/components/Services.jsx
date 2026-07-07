import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import useScrollReveal from '../hooks/useScrollReveal'
import { fadeUp, staggerContainer, staggerItem } from '../animations/variants'
import { useWhatsApp } from '../context/WhatsAppContext'

const serviceCategories = [
  {
    id: 'hair-cuts',
    title: 'Cortes',
    services: [
      {
        name: 'Corte de Dama',
        price: '$200',
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
        price: '$100',
        description: 'Aplicación profesional usando el tinte que tú traigas.',
        duration: '1 hr aprox.',
        includes: 'Solo mano de obra, no incluye producto ni estilizado',
      },
      {
        name: 'Tinte Global (c. corto)',
        price: '$400+',
        description: 'Color uniforme de raíz a puntas para renovar completamente tu tono.',
        duration: '1.5–2 hrs aprox.',
        includes: 'Incluye producto, lavado y secado',
      },
      {
        name: 'Retoque de Raíz (hasta 1.5 cm)',
        price: '$250',
        description: 'Cubre el crecimiento natural manteniendo el tono uniforme.',
        duration: '1 hr aprox.',
        includes: 'Incluye producto y lavado',
      },
      {
        name: 'Mechas y Rayos (c. corto)',
        price: '$600+',
        description: 'Iluminación parcial con papel o gorro para dar dimensión al cabello.',
        duration: '2–2.5 hrs aprox.',
        includes: 'Incluye matizado, lavado y secado',
      },
      {
        name: 'Balayage y Babylight',
        price: '$900+',
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
        price: '$380',
        description: 'Una extensión por cada pestaña natural, efecto natural y elegante.',
        duration: '1.5 hrs aprox.',
        includes: 'Duración aprox. 3 semanas',
      },
      {
        name: 'Pestañas Híbridas',
        price: '$400',
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
        price: '$400',
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

const ServiceRow = ({ service, isOpen, onToggle }) => (
  <motion.div variants={staggerItem} className="py-xs">
    <button
      onClick={() => onToggle(service.name)}
      className="w-full flex justify-between items-baseline group cursor-pointer text-left"
      aria-expanded={isOpen}
    >
      <span className="font-body-md text-body-md group-hover:text-primary transition-colors">
        {service.name}
      </span>
      <div className="flex-grow mx-base border-b border-dotted border-outline-variant/30" />
      <span className="font-label-md text-label-md text-secondary whitespace-nowrap">
        {service.price}
      </span>
    </button>

    <AnimatePresence initial={false}>
      {isOpen && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="overflow-hidden"
        >
          <div className="pt-sm pb-base pl-base border-l-2 border-primary/20 ml-xs mt-xs">
            <p className="font-body-md text-body-md text-on-surface-variant mb-xs">
              {service.description}
            </p>
            <p className="font-label-sm text-label-sm text-secondary">
              ⏱ {service.duration} · {service.includes}
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  </motion.div>
)

// AHORA recibe openService y onToggle como props — ya no tiene su propio useState
const ServiceCategory = ({ title, services, openService, onToggle }) => {
  const { ref, controls } = useScrollReveal()

  return (
    <motion.div
      ref={ref}
      variants={staggerContainer}
      initial="hidden"
      animate={controls}
      className="space-y-xs"
    >
      <motion.h3
        variants={staggerItem}
        className="font-headline-md text-headline-md border-b border-primary/10 pb-base text-primary mb-sm"
      >
        {title}
      </motion.h3>
      <div>
        {services.map((service) => (
          <ServiceRow
            key={service.name}
            service={service}
            isOpen={openService === service.name}
            onToggle={onToggle}
          />
        ))}
      </div>
    </motion.div>
  )
}

const Services = () => {
  const header = useScrollReveal()
  const note = useScrollReveal()
  const disclaimer = useScrollReveal()
  const { openWhatsApp } = useWhatsApp()

  // El estado ahora vive aquí, en el ancestro común de TODAS las categorías
  const [openService, setOpenService] = useState(null)

  const handleToggle = (name) => {
    setOpenService((prev) => (prev === name ? null : name))
  }

  return (
    <section id="services" className="py-xl">
      <div className="max-w-container-max mx-auto px-md">

        <motion.div
          ref={header.ref}
          variants={fadeUp}
          initial="hidden"
          animate={header.controls}
          className="text-center mb-xl"
        >
          <span className="font-label-md text-label-md text-primary tracking-[0.2em] uppercase block mb-sm">
            Menú de Servicios
          </span>
          <h2 className="font-display-lg text-5xl md:text-6xl text-on-background">
            Precios & Servicios
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-x-xl gap-y-lg">
          {serviceCategories.map((category) => (
            <ServiceCategory
              key={category.id}
              title={category.title}
              services={category.services}
              openService={openService}
              onToggle={handleToggle}
            />
          ))}
        </div>

        <motion.div
          ref={disclaimer.ref}
          variants={fadeUp}
          initial="hidden"
          animate={disclaimer.controls}
          className="mt-lg p-lg bg-surface-container-low rounded-sm border border-primary/5 w-full max-w-2xl mx-auto"
        >
          <h4 className="font-label-md text-label-md text-primary uppercase tracking-wider mb-sm text-center">
            Notas Importantes
          </h4>
          <ul className="space-y-xs">
            <li className="font-body-md text-body-md text-on-surface-variant">
              · Los precios con <strong>+</strong> aumentan según el largo y volumen del cabello.
            </li>
            <li className="font-body-md text-body-md text-on-surface-variant">
              · El diseño de uñas se cotiza por WhatsApp — puede tener costo adicional.
            </li>
            <li className="font-body-md text-body-md text-on-surface-variant">
              · Para pestañas, acudir <strong>sin maquillaje</strong> a la cita.
            </li>
            <li className="font-body-md text-body-md text-on-surface-variant">
              · Atención <strong>exclusiva con cita previa</strong>, una clienta a la vez.
            </li>
          </ul>
        </motion.div>

        <motion.div
          ref={note.ref}
          variants={fadeUp}
          initial="hidden"
          animate={note.controls}
          className="mt-md text-center"
        >
          <p className="font-body-md text-body-md text-secondary mb-sm">
            ¿Tienes dudas sobre algún servicio o precio?
          </p>
          <button onClick={openWhatsApp} className="inline-block bg-primary text-on-primary px-lg py-sm rounded-sm font-label-md hover:opacity-90 transition-opacity">
          Consultar por WhatsApp
          </button>
        </motion.div>

      </div>
    </section>
  )
}

export default Services