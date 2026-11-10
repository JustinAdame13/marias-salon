import { motion } from 'framer-motion'
import { useWhatsApp } from '../context/WhatsAppContext'
import { SparkleIcon, WhatsAppIcon } from './icons'

// Productos Salerm que se venden en el salón.
// Los datos viven en un arreglo (igual que serviceCategories en Services.jsx):
// si mañana llega un tercer producto, solo se agrega un objeto aquí
// y la tarjeta se genera sola con .map().
const PRODUCTS = [
  {
    id: 'salerm-21',
    brand: 'Salerm Cosmetics',
    name: 'Salerm 21',
    tagline: 'Hidratación, protección y brillo',
    image: '/productos/salerm-21.webp',
    alt: 'Tubo de Salerm 21 Silk Protein Leave-in Conditioner sobre un pedestal de mármol con fondo rosa',
    description:
      'Más que un acondicionador: es una mascarilla hidratante sin aclarado. Su fórmula con proteínas de seda llega hasta la médula del cabello, aportando brillo y vida desde el primer uso, y lo protege del sol, cloro, salitre y calor.',
    benefits: ['Superhidratante', 'Protección térmica', 'Proteínas de seda', 'Resultado inmediato'],
    usage: [
      { label: 'Hidratante', text: 'Tras el lavado, aplica una avellana repartida por todo el cabello, insistiendo en puntas y zonas castigadas. No enjuagar. Peinar.' },
      { label: 'Mascarilla', text: 'En cabellos muy castigados, aplica entre 5 y 10 ml. Deja actuar 5 minutos, enjuaga y peina.' },
      { label: 'Protector', text: 'Para evitar roturas por enredos, aplica una avellana en seco y peina.' },
    ],
    note: 'Ideal para todo tipo de cabello, con o sin enjuague.',
  },
  {
    id: 'protein-force',
    brand: 'Hair Lab by Salerm',
    name: 'Protein Force',
    tagline: 'Mascarilla fortalecedora',
    image: '/productos/protein-force.webp',
    alt: 'Bote de mascarilla Hair Lab Protein Force de Salerm sobre un pedestal de mármol con fondo rosa',
    description:
      'Gama reparadora y nutritiva que repone la falta de queratina natural y da cuerpo a la melena. Formulada con queratina hidrolizada de bajo peso molecular, rica en cistinas, para un cabello visiblemente más sano.',
    benefits: ['Reforzador de queratina', 'Acción rellenadora', 'Booster de colágeno', 'Sin parabenos'],
    usage: [
      { label: 'Modo de uso', text: 'Aplica sobre el cabello húmedo y previamente lavado. Insiste de medios a puntas, masajea, deja actuar unos minutos y enjuaga.' },
    ],
    note: 'Especialmente indicada para cabello dañado: evita puntas abiertas y rotura.',
  },
]

const ease = [0.16, 1, 0.3, 1]

// ---------- Tarjeta de un producto ----------
const ProductCard = ({ product, index, onAsk }) => (
  <motion.article
    initial={{ opacity: 0, y: 28 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.2 }}
    transition={{ duration: 0.8, ease, delay: index * 0.1 }}
    className="glass flex flex-col overflow-hidden rounded-[1.75rem]"
  >
    {/* width/height le dicen al navegador la proporción (3:2) ANTES de
        descargar la imagen, así reserva el espacio y la página no "brinca".
        loading="lazy": solo se descarga cuando está cerca de verse. */}
    <img
      src={product.image}
      alt={product.alt}
      width="1200"
      height="800"
      loading="lazy"
      decoding="async"
      className="aspect-[3/2] w-full object-cover"
    />

    <div className="flex flex-1 flex-col p-5 sm:p-6">
      <span className="font-label-md text-xs uppercase tracking-[0.25em] text-gold-ink">
        {product.brand}
      </span>
      <h3 className="mt-2 font-['Bodoni_Moda'] text-3xl leading-tight text-on-background">
        {product.name}
      </h3>
      <p className="mt-1 font-body-md text-base italic text-primary">{product.tagline}</p>

      <p className="mt-4 font-body-md text-sm leading-relaxed text-on-surface-variant sm:text-[0.95rem]">
        {product.description}
      </p>

      <ul className="mt-4 flex flex-wrap gap-2">
        {product.benefits.map((b) => (
          <li
            key={b}
            className="inline-flex items-center gap-1.5 rounded-full border border-primary/15 bg-white/60 px-3 py-1 font-label-sm text-xs text-on-surface-variant"
          >
            <SparkleIcon size={13} /> {b}
          </li>
        ))}
      </ul>

      {/* <details>/<summary> es un acordeón NATIVO de HTML: abre y cierra
          sin useState ni JavaScript, y ya es accesible con teclado. */}
      <details className="group mt-5 rounded-2xl border border-gold/30 bg-white/40 px-4 py-3">
        <summary className="flex cursor-pointer list-none items-center justify-between font-label-md text-sm font-medium text-primary [&::-webkit-details-marker]:hidden">
          ¿Cómo se usa?
          <span className="text-lg leading-none transition-transform duration-300 group-open:rotate-45">+</span>
        </summary>
        <dl className="mt-3 space-y-2.5 font-body-md text-sm leading-relaxed text-on-surface-variant">
          {product.usage.map((u) => (
            <div key={u.label}>
              <dt className="font-semibold text-on-background">{u.label}</dt>
              <dd>{u.text}</dd>
            </div>
          ))}
        </dl>
      </details>

      <p className="mt-4 font-body-md text-sm text-secondary">{product.note}</p>

      {/* mt-auto empuja el botón al fondo: así ambas tarjetas alinean
          sus botones aunque una tenga más texto que la otra */}
      <div className="mt-auto pt-5">
        <button
          type="button"
          onClick={() => onAsk(product)}
          className="inline-flex items-center gap-2 rounded-full border border-primary/25 px-4 py-2 font-label-md text-sm font-medium text-primary transition-colors hover:bg-primary hover:text-on-primary"
        >
          <WhatsAppIcon size={16} />
          Preguntar por este producto
        </button>
      </div>
    </div>
  </motion.article>
)

// ---------- Sección completa ----------
const Products = () => {
  const { openWhatsApp } = useWhatsApp()

  const handleAsk = (product) => {
    openWhatsApp(
      `Hola 😊 Me interesa el producto *${product.name}* de ${product.brand}. ¿Tienen disponible y cuál es su precio? ✨`
    )
  }

  return (
    <section id="products" className="py-14 sm:py-20">
      <div className="mx-auto max-w-container-max px-4 sm:px-md">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.8, ease }}
          className="mx-auto max-w-[40rem] text-center"
        >
          <span className="font-label-md text-xs uppercase tracking-[0.25em] text-gold-ink">
            Productos profesionales
          </span>
          <h2 className="mt-3 font-['Bodoni_Moda'] text-4xl text-on-background sm:text-5xl md:text-6xl">
            El cuidado <span className="italic text-primary">Salerm</span>
          </h2>
          <div className="mx-auto mt-5 w-24 gold-rule" />
          <p className="mt-5 font-body-md text-base leading-relaxed text-secondary">
            En el salón trabajamos con productos profesionales de Salerm Cosmetics,
            y ahora también puedes llevarlos a casa para mantener tu cabello
            sano entre cada visita.
          </p>
        </motion.div>

        <div className="mx-auto mt-10 grid max-w-[64rem] gap-6 md:grid-cols-2">
          {PRODUCTS.map((product, i) => (
            <ProductCard key={product.id} product={product} index={i} onAsk={handleAsk} />
          ))}
        </div>
      </div>
    </section>
  )
}

export default Products
