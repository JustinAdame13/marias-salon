import { motion } from 'framer-motion'
import { fadeUp, fadeLeft, fadeRight } from '../animations/variants'
import fotoMaria from '../assets/maria.jpeg'

const Hero = () => {
  return (
    <section className="relative min-h-fit md:min-h-screen flex items-center overflow-hidden pt-6 md:pt-4 pb-lg md:pb-0">
      <div className="max-w-container-max mx-auto px-md grid md:grid-cols-2 gap-lg md:gap-xl items-center">

        {/* Imagen — primero en móvil (order-1), vuelve a su lugar original en desktop */}
        <motion.div
          variants={fadeRight}
          initial="hidden"
          whileInView="visible"
          transition={{ delay: 0.1 }}
          className="relative order-1 md:order-none"
          viewport={{ once: false, amount: 0.3 }}
        >
          <div className="w-full aspect-[4/3] md:aspect-[4/5] relative rounded-3xl md:rounded-sm overflow-hidden shadow-xl">
            <img
              src={fotoMaria}
              alt="Maria Guadalupe García Rentería, estilista profesional en Maria's Beauty Salon"
              className="w-full h-full object-cover"
            />

            {/* Overlay con cita — SOLO en móvil, ocupa la base de la imagen */}
            <div className="md:hidden absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent pt-16 pb-md px-md">
              <p className="font-headline-md text-lg italic text-white">
                "Belleza es equilibrio."
              </p>
              <p className="font-label-sm text-label-sm text-white/80 uppercase tracking-widest mt-1">
                — Maria, Estilista profesional
              </p>
            </div>
          </div>

          {/* Tarjeta flotante — solo desktop, igual que antes */}
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
              — Maria, Estilista profesional
            </p>
          </motion.div>
        </motion.div>

        {/* Columna de texto — segundo en móvil (order-2) */}
        <motion.div
          variants={fadeLeft}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.3 }}
          className="text-center md:text-left order-2 md:order-none mt-lg md:mt-0"
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
            Un espacio donde la serenidad se encuentra
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

      </div>
    </section>
  )
}

export default Hero