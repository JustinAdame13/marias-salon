// Datos separados de la presentación — si mañana cambias un precio,
// solo tocas este array, no el HTML/JSX
const serviceCategories = [
  {
    id: 'hair',
    title: 'Peluquería & Color',
    services: [
      { name: 'Corte de Autor (Dama/Caballero)', price: '$450+' },
      { name: 'Color Global & Diseño', price: '$1,200+' },
      { name: 'Tratamientos Alisantes', price: '$2,500+' },
      { name: 'Ondulados & Perms', price: '$1,800+' },
    ],
  },
  {
    id: 'nails',
    title: 'Cuidado de Uñas',
    services: [
      { name: 'Manicura Spa', price: '$350+' },
      { name: 'Uñas Acrílicas Esculturales', price: '$750+' },
      { name: 'Pedicura Médica & Spa', price: '$550+' },
    ],
  },
  {
    id: 'beauty',
    title: 'Estética & Mirada',
    services: [
      { name: 'Maquillaje Profesional', price: '$850+' },
      { name: 'Extensión de Pestañas (Classic)', price: '$600+' },
    ],
  },
]

// Componente pequeño reutilizable para cada fila de servicio
const ServiceRow = ({ name, price }) => {
  return (
    <div className="flex justify-between items-baseline group cursor-default">
      <span className="font-body-lg text-body-lg group-hover:text-primary transition-colors">
        {name}
      </span>
      <div className="flex-grow mx-base border-b border-dotted border-outline-variant/30" />
      <span className="font-label-md text-label-md text-secondary">
        {price}
      </span>
    </div>
  )
}

// Componente para cada categoría de servicios
const ServiceCategory = ({ title, services }) => {
  return (
    <div className="space-y-sm">
      <h3 className="font-headline-md text-headline-md border-b border-primary/10 pb-base text-primary">
        {title}
      </h3>
      <div className="space-y-sm">
        {services.map((service) => (
          <ServiceRow
            key={service.name}
            name={service.name}
            price={service.price}
          />
        ))}
      </div>
    </div>
  )
}

// Componente principal de la sección
const Services = () => {
  return (
    <section id="services" className="py-xl">
      <div className="max-w-container-max mx-auto px-md">

        {/* Encabezado */}
        <div className="text-center mb-xl">
          <span className="font-label-md text-label-md text-primary tracking-[0.2em] uppercase block mb-sm">
            Menú de Especialidades
          </span>
          <h2 className="font-display-lg text-5xl md:text-6xl text-on-background">
            Servicios de Autor
          </h2>
        </div>

        {/* Grid de categorías */}
        <div className="grid md:grid-cols-2 gap-x-xl gap-y-lg">
          {serviceCategories.map((category) => (
            <ServiceCategory
              key={category.id}
              title={category.title}
              services={category.services}
            />
          ))}
        </div>

        {/* Nota signature */}
        <div className="mt-lg p-lg bg-surface-container-low rounded-sm border border-primary/5 max-w-xl mx-auto text-center">
          <h4 className="font-label-md text-label-md text-primary uppercase tracking-wider mb-sm">
            Servicios Signature
          </h4>
          <p className="font-body-md text-body-md text-on-surface-variant italic">
            "Nuestros servicios incluyen una consulta personalizada 
            y aromaterapia de cortesía para elevar su experiencia."
          </p>
        </div>

      </div>
    </section>
  )
}

export default Services