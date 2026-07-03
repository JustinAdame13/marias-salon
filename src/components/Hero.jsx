import { motion } from 'framer-motion'
import { fadeUp, fadeLeft, fadeRight } from '../animations/variants'
import fotoMaria from '../assets/maria.jpeg'

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden pt-4">
      <div className="max-w-container-max mx-auto px-md grid md:grid-cols-2 gap-xl items-center">

        {/* Columna izquierda — centrada en mobile, izquierda en desktop */}
        <motion.div
          variants={fadeLeft}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.3 }}
          className="text-center md:text-left"
        >
          <motion.h1
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            transition={{ delay: 0.2 }}
            className="font-['Bodoni_Moda'] text-4xl sm:text-5xl md:text-8xl text-primary leading-tight md:leading-none mb-md"
            viewport={{ once: false, amount: 0.3 }}
          >
            Bienvenidos a{' '}
            <span className="italic font-light">
              Maria's Beauty Salon
            </span>
          </motion.h1>

          <motion.p
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            transition={{ delay: 0.55 }}
            className="font-body-md text-body-md md:text-body-lg text-secondary max-w-prose mx-auto md:mx-0 mb-lg"
            viewport={{ once: false, amount: 0.3 }}
          >
            Un espacio boutique donde la serenidad se encuentra
            con la excelencia técnica. Redescubre tu estilo en
            un entorno de calma y profesionalismo.
          </motion.p>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            transition={{ delay: 0.85 }}
            className="flex gap-md flex-wrap justify-center md:justify-start"
            viewport={{ once: false, amount: 0.3 }}
          >
            <a
              href="#services"
              className="bg-primary text-on-primary px-lg py-sm rounded-sm font-label-md transition-all hover:-translate-y-0.5 hover:shadow-lg"
            >
              Explorar Servicios
            </a>
            <a
              href="#about"
              className="border border-primary/20 text-primary px-lg py-sm rounded-sm font-label-md hover:bg-primary-container/10 transition-all"
            >
              Nuestra Historia
            </a>
          </motion.div>
        </motion.div>

        {/* Columna derecha — foto, con techo de tamaño en mobile */}
        <motion.div
          variants={fadeRight}
          initial="hidden"
          whileInView="visible"
          transition={{ delay: 0.2 }}
          className="relative mt-lg md:mt-0"
          viewport={{ once: false, amount: 0.3 }}
        >
          <div className="w-full max-w-xs sm:max-w-sm md:max-w-none aspect-[4/5] relative rounded-sm overflow-hidden shadow-xl mx-auto md:mx-0">
            <img
              src={fotoMaria}
              alt="Maria Guadalupe García Rentería, estilista profesional en Maria's Beauty Salon"
              className="w-full h-full object-cover"
            />
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1, duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            viewport={{ once: false, amount: 0.3 }}
            className="absolute -bottom-8 -left-4 bg-surface-container-low p-lg border border-outline-variant/10 shadow-lg hidden md:block rounded-sm"
          >
            <p className="font-headline-md text-xl italic text-primary">
              "Belleza es equilibrio."
            </p>
            <p className="font-label-sm text-label-sm text-secondary uppercase tracking-widest mt-base">
              — Maria, Directora Creativa
            </p>
          </motion.div>
        </motion.div>

      </div>
    </section>
  )
}

export default Hero