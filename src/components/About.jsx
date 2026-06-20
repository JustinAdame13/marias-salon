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
              Maria Guadalupe García Rentería es estilista profesional 
              con 22 años de experiencia, nacida y formada en Torreón, Coahuila. 
              Desde joven descubrió su vocación en una escuela de estilismo, 
              donde dominó corte femenino, peinado, colorimetría y técnicas 
              de ondulación. Con el tiempo fue ampliando su oficio hasta 
              abarcar uñas, pedicura, tratamientos capilares, laminado de 
              cejas, extensión de pestañas pelo a pelo y maquillaje profesional.
            </p>
            <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
              Su salón es un espacio íntimo y personal — atiende 
              exclusivamente con cita previa y dedica su atención completa 
              a una sola clienta a la vez. No es un salón de producción 
              masiva: es un refugio donde cada visita recibe el tiempo, 
              la calma y el cuidado que merece.
            </p>
          </motion.div>

        </div>
      </div>
    </section>
  )
}

export default About