import { motion } from 'framer-motion'
import { fadeUp, fadeLeft, fadeRight } from '../animations/variants'

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden pt-4">
      <div className="max-w-container-max mx-auto px-md grid md:grid-cols-2 gap-xl items-center">

        {/* Columna izquierda — entra desde la izquierda */}
        <motion.div
          variants={fadeLeft}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.3 }}
        >
          <motion.h1
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            transition={{ delay: 0.2 }}
            className="font-['Bodoni_Moda'] text-6xl md:text-8xl text-primary leading-none mb-md"
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
            className="font-body-md text-body-lg text-secondary max-w-prose mb-lg"
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
            className="flex gap-md flex-wrap"
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

        {/* Columna derecha — entra desde la derecha */}
        <motion.div
          variants={fadeRight}
          initial="hidden"
          whileInView="visible"
          transition={{ delay: 0.2 }}
          className="relative flex justify-end"
          viewport={{ once: false, amount: 0.3 }}
        >
          <div className="w-full max-w-sm aspect-[4/5] relative bg-surface-container-high rounded-sm flex items-center justify-center">
            <p className="text-on-surface-variant font-body-md text-center px-md">
              📸 Foto de Maria<br/>
              <span className="text-sm opacity-60">(próximamente)</span>
            </p>
          </div>

          <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}  // ← cambio
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