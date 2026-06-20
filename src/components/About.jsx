import { motion } from 'framer-motion'
import useScrollReveal from '../hooks/useScrollReveal'
import { fadeLeft, fadeRight } from '../animations/variants'

const About = () => {
  const left = useScrollReveal()
  const right = useScrollReveal()

  return (
    <section id="about" className="py-xl bg-surface-container-lowest">
      <div className="max-w-container-max mx-auto px-md">

        <div className="h-px bg-gradient-to-r from-transparent via-outline-variant to-transparent opacity-30 mb-xl" />

        <div className="grid md:grid-cols-12 gap-lg items-start">

          <motion.div
            ref={left.ref}
            variants={fadeLeft}
            initial="hidden"
            animate={left.controls}
            className="md:col-span-5"
          >
            <span className="font-label-md text-label-md text-primary tracking-[0.2em] uppercase block mb-sm">
              Trayectoria Profesional
            </span>
            <h2 className="font-headline-lg text-headline-lg text-on-background">
              El Arte Detrás <br /> de Maria
            </h2>
          </motion.div>

          <motion.div
            ref={right.ref}
            variants={fadeRight}
            initial="hidden"
            animate={right.controls}
            className="md:col-span-7"
          >
            <p className="font-body-lg text-body-lg text-secondary leading-relaxed mb-lg">
              Con más de quince años de experiencia en la industria
              de la alta peluquería, Maria ha cultivado una filosofía
              centrada en la individualidad. Formada en las capitales
              de la moda y perfeccionando su técnica en Torreón, cada
              servicio es una mezcla de precisión técnica y visión artística.
            </p>
            <p className="font-body-md text-body-md text-on-surface-variant">
              Nuestro salón no es solo un lugar de transformación, sino
              un refugio. Creemos que el cuidado personal es una forma
              de meditación, y hemos diseñado cada rincón de Maria's
              para reflejar esa tranquilidad boutique que nuestros
              clientes merecen.
            </p>
          </motion.div>

        </div>
      </div>
    </section>
  )
}

export default About