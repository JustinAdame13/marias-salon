import { motion } from 'framer-motion'
import fotoMaria from '../assets/maria.jpeg'
import { useWhatsApp } from '../context/WhatsAppContext'
import { ArrowIcon, SparkleIcon } from './icons'

// Animación de entrada en cascada: el contenedor "reparte" el inicio
// de cada hijo con staggerChildren. Duraciones cortas (0.7s) se sienten
// más ágiles en celular que las de 1.4s que teníamos.
const ease = [0.16, 1, 0.3, 1]
const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.09, delayChildren: 0.05 } },
}
const item = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease } },
}

const STATS = [
  { value: '22', label: 'años de experiencia' },
  { value: '1', label: 'clienta a la vez' },
  { value: 'Lun–Sáb', label: '9:00 a 20:00' },
]

const Hero = () => {
  const { openWhatsApp } = useWhatsApp()

  return (
    <section id="inicio" className="relative pt-6 pb-12 sm:pt-10 md:pb-20 md:pt-14">
      <div className="mx-auto grid max-w-container-max items-center gap-10 px-4 sm:px-md md:grid-cols-[1.05fr_1fr] md:gap-16">

        {/* ---------- Texto ---------- */}
        <motion.div variants={container} initial="hidden" animate="visible" className="text-center md:text-left">
          <motion.span
            variants={item}
            className="glass inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 font-label-md text-xs tracking-wide text-on-surface-variant"
          >
            <span className="size-1.5 rounded-full bg-gold" />
            Torreón, Coahuila · Solo con cita
          </motion.span>

          <motion.h1
            variants={item}
            className="mt-5 font-['Bodoni_Moda'] text-[2.6rem] leading-[1.05] text-on-background sm:text-6xl md:text-7xl"
          >
            Belleza es{' '}
            <span className="italic text-primary">equilibrio.</span>
          </motion.h1>

          <motion.div variants={item} className="mx-auto mt-5 w-24 gold-rule md:mx-0" />

          <motion.p
            variants={item}
            className="mx-auto mt-5 max-w-[28rem] font-body-md text-base leading-relaxed text-secondary sm:text-lg md:mx-0"
          >
            Un espacio donde la serenidad se encuentra con la excelencia técnica.
            Redescubre tu estilo en un entorno de calma y profesionalismo.
          </motion.p>

          <motion.div
            variants={item}
            className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center md:justify-start"
          >
            <button
              type="button"
              onClick={() => openWhatsApp()}
              className="btn-rose inline-flex h-13 items-center justify-center gap-2 rounded-full px-7 font-label-md text-[0.95rem] font-medium transition-transform hover:-translate-y-0.5 active:scale-[0.97]"
            >
              Reservar mi cita
              <ArrowIcon size={18} />
            </button>
            <a
              href="#services"
              className="glass inline-flex h-13 items-center justify-center rounded-full px-7 font-label-md text-[0.95rem] font-medium text-primary transition-transform hover:-translate-y-0.5 active:scale-[0.97]"
            >
              Ver servicios y precios
            </a>
          </motion.div>

          {/* Estadísticas rápidas en vidrio */}
          <motion.ul variants={item} className="mt-8 grid grid-cols-3 gap-2 sm:gap-3">
            {STATS.map((s) => (
              <li key={s.label} className="glass rounded-2xl px-2 py-3 text-center md:text-left md:px-4">
                <p className="font-['Bodoni_Moda'] text-xl text-primary sm:text-2xl">{s.value}</p>
                <p className="mt-0.5 font-label-sm text-[0.7rem] leading-tight text-on-surface-variant sm:text-xs">
                  {s.label}
                </p>
              </li>
            ))}
          </motion.ul>
        </motion.div>

        {/* ---------- Foto ---------- */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, ease, delay: 0.15 }}
          className="relative mx-auto w-full max-w-[28rem] md:max-w-none"
        >
          {/* Halo de color detrás de la foto */}
          <div
            aria-hidden
            className="absolute -inset-4 -z-10 rounded-[2.5rem] bg-gradient-to-br from-blush/40 via-primary-container/50 to-gold/25 blur-2xl"
          />

          <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] shadow-[0_30px_60px_-25px_rgb(110_58_66/0.45)] ring-1 ring-white/60">
            <img
              src={fotoMaria}
              alt="Maria Guadalupe García Rentería, estilista profesional en Maria's Beauty Salon"
              className="size-full object-cover"
              fetchPriority="high"
            />

            {/* Insignia flotante arriba */}
            <span className="glass glass-strong absolute right-3 top-3 inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 font-label-md text-xs text-primary">
              <SparkleIcon size={14} />
              Atención personalizada
            </span>

            {/* Tarjeta de vidrio sobre la foto */}
            <div className="glass glass-strong absolute inset-x-3 bottom-3 rounded-3xl p-4 sm:inset-x-4 sm:bottom-4 sm:p-5">
              <p className="font-['Bodoni_Moda'] text-lg italic text-on-background sm:text-xl">
                Maria García Rentería
              </p>
              <p className="mt-0.5 font-label-sm text-xs uppercase tracking-[0.18em] text-gold-ink">
                Estilista profesional
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default Hero
