import { motion } from 'framer-motion'

const ease = [0.16, 1, 0.3, 1]
// whileInView + once:true → anima una sola vez al aparecer.
// Antes las secciones se ocultaban/mostraban cada vez que hacías scroll,
// lo cual en celular se siente "saltón".
const reveal = {
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.25 },
  transition: { duration: 0.8, ease },
}

const SPECIALTIES = [
  'Corte femenino',
  'Colorimetría',
  'Peinado',
  'Ondulación',
  'Tratamientos capilares',
  'Uñas y pedicura',
  'Laminado de cejas',
  'Pestañas pelo a pelo',
  'Maquillaje profesional',
]

const About = () => {
  return (
    <section id="about" className="py-14 sm:py-20">
      <div className="mx-auto max-w-container-max px-4 sm:px-md">
        <div className="grid gap-8 md:grid-cols-12 md:gap-12">

          <motion.div {...reveal} className="md:col-span-5">
            <span className="font-label-md text-xs uppercase tracking-[0.25em] text-gold-ink">
              Trayectoria profesional
            </span>
            <h2 className="mt-3 font-['Bodoni_Moda'] text-4xl leading-tight text-on-background sm:text-5xl">
              El arte detrás <br />
              <span className="italic text-primary">de Maria</span>
            </h2>
            <div className="mt-5 w-24 gold-rule" />

            {/* Tarjeta de vidrio con la cifra principal */}
            <div className="glass mt-8 flex items-center gap-4 rounded-3xl p-5">
              <p className="font-['Bodoni_Moda'] text-5xl leading-none text-primary">22</p>
              <p className="font-body-md text-sm leading-snug text-on-surface-variant">
                años perfeccionando su oficio,<br />nacida y formada en Torreón.
              </p>
            </div>
          </motion.div>

          <motion.div {...reveal} transition={{ ...reveal.transition, delay: 0.1 }} className="md:col-span-7">
            <p className="font-body-md text-base leading-relaxed text-secondary sm:text-lg">
              Maria Guadalupe García Rentería es estilista profesional con 22 años de
              experiencia. Desde joven descubrió su vocación en una escuela de estilismo,
              donde dominó corte femenino, peinado, colorimetría y técnicas de ondulación.
              Con el tiempo amplió su oficio hasta abarcar uñas, pedicura, tratamientos
              capilares, laminado de cejas, extensión de pestañas pelo a pelo y maquillaje
              profesional.
            </p>

            <blockquote className="glass mt-6 rounded-3xl p-5 sm:p-6">
              <p className="font-body-md text-base leading-relaxed text-on-surface-variant">
                Su salón es un espacio íntimo y personal: atiende exclusivamente con cita
                previa y dedica su atención completa a <strong className="font-semibold text-primary">una sola clienta a la vez</strong>.
                No es un salón de producción masiva, es un refugio donde cada visita recibe
                el tiempo, la calma y el cuidado que merece.
              </p>
            </blockquote>

            <h3 className="mt-8 font-label-md text-xs uppercase tracking-[0.25em] text-gold-ink">
              Especialidades
            </h3>
            <ul className="mt-3 flex flex-wrap gap-2">
              {SPECIALTIES.map((s) => (
                <li
                  key={s}
                  className="rounded-full border border-primary/15 bg-white/50 px-3.5 py-1.5 font-label-md text-sm text-on-surface-variant"
                >
                  {s}
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default About
