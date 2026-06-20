import { motion } from 'framer-motion'
import useScrollReveal from '../hooks/useScrollReveal'
import { fadeUp, staggerContainer, staggerItem } from '../animations/variants'

const serviceCategories = [
  {
    id: 'hair-cuts',
    title: 'Cortes',
    services: [
      { name: 'Corte de Dama', price: '$200' },
      { name: 'Corte de Caballero', price: '$150' },
      { name: 'Corte de Niño', price: '$100' },
    ],
  },
  {
    id: 'color',
    title: 'Color & Mechas',
    services: [
      { name: 'Aplicación de Tinte (tinte propio)', price: '$100' },
      { name: 'Tinte Global (c. corto)', price: '$400+' },
      { name: 'Retoque de Raíz (hasta 1.5 cm)', price: '$250' },
      { name: 'Mechas y Rayos (c. corto)', price: '$600+' },
      { name: 'Balayage y Babylight', price: '$900+' },
    ],
  },
  {
    id: 'treatments',
    title: 'Tratamientos & Peinados',
    services: [
      { name: 'Tratamiento Extrahidratación', price: '$500+' },
      { name: 'Estilizado de Cabello', price: '$150' },
      { name: 'Planchado', price: '$200' },
      { name: 'Ondas o Rulos', price: '$300' },
      { name: 'Peinado Elaborado', price: '$400' },
      { name: 'Maquillaje Social + Peinado', price: '$1,000' },
      { name: 'Maquillaje Social', price: '$800' },
    ],
  },
  {
    id: 'lashes-brows',
    title: 'Cejas & Pestañas',
    services: [
      { name: 'Laminado y Perfilación de Ceja', price: '$250' },
      { name: 'Henné de Ceja', price: '$200' },
      { name: 'Henné + Laminado + Perfilación', price: '$350' },
      { name: 'Retiro de Pestañas Postizas', price: '$100' },
      { name: 'Pestañas Clásicas (pelo a pelo)', price: '$380' },
      { name: 'Pestañas Híbridas', price: '$400' },
      { name: 'Pestañas Hawaianas', price: '$400' },
      { name: 'Pestañas Griego', price: '$400' },
      { name: 'Volumen Tecno 5D/6D', price: '$550' },
    ],
  },
  {
    id: 'nails-hands',
    title: 'Uñas de Manos',
    services: [
      { name: 'Acrílico', price: '$280' },
      { name: 'Polygel', price: '$280' },
      { name: 'Largo #1', price: '$300' },
      { name: 'Largo #2', price: '$350' },
      { name: 'Largo #3', price: '$400' },
      { name: 'Largo #4', price: '$450' },
      { name: 'Largo #5', price: '$500' },
      { name: 'Largo #6', price: '$550' },
      { name: 'Gelish Semipermanente (1-2 colores)', price: '$150' },
    ],
  },
  {
    id: 'nails-feet',
    title: 'Uñas de Pies',
    services: [
      { name: 'Pedicura con Esmaltado', price: '$400' },
      { name: 'Esmalte Semipermanente', price: '$150' },
      { name: 'Acrílico en Pies', price: '$200' },
      { name: 'Quitar Producto de Uñas', price: '$80' },
    ],
  },
]

// Nota: precios en pesos mexicanos MXN
// Los precios con (+) aumentan según largo y volumen del cabello
// El diseño de uñas se cotiza por WhatsApp

const ServiceRow = ({ name, price }) => (
  <motion.div
    variants={staggerItem}
    className="flex justify-between items-baseline group cursor-default py-xs"
  >
    <span className="font-body-md text-body-md group-hover:text-primary transition-colors">
      {name}
    </span>
    <div className="flex-grow mx-base border-b border-dotted border-outline-variant/30" />
    <span className="font-label-md text-label-md text-secondary whitespace-nowrap">
      {price}
    </span>
  </motion.div>
)

const ServiceCategory = ({ title, services }) => {
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
          <ServiceRow key={service.name} name={service.name} price={service.price} />
        ))}
      </div>
    </motion.div>
  )
}

const Services = () => {
  const header = useScrollReveal()
  const note = useScrollReveal()
  const disclaimer = useScrollReveal()

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

        {/* Grid de 2 columnas en desktop */}
        <div className="grid md:grid-cols-2 gap-x-xl gap-y-lg">
          {serviceCategories.map((category) => (
            <ServiceCategory
              key={category.id}
              title={category.title}
              services={category.services}
            />
          ))}
        </div>

        {/* Notas importantes */}
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

        {/* CTA WhatsApp */}
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
          <a
            href="https://wa.me/528713318615?text=Hola%2C%20me%20gustar%C3%ADa%20informaci%C3%B3n%20sobre%20los%20servicios%20de%20Maria%27s%20Beauty%20Salon"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-primary text-on-primary px-lg py-sm rounded-sm font-label-md hover:opacity-90 transition-opacity"
          >
            Consultar por WhatsApp
          </a>
        </motion.div>

      </div>
    </section>
  )
}

export default Services