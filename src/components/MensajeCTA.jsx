import { motion } from 'framer-motion'
import { fadeUp } from '../animations/variants'
import { useWhatsApp } from '../context/WhatsAppContext'

const MensajeCTA = ({ eyebrow, title, description, whatsappMessage, ctaLabel, emoji }) => {
  const { openWhatsApp } = useWhatsApp()

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background p-4 box-border">
      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        style={{ width: '90vw', maxWidth: '420px', minWidth: '280px' }}
        className="bg-surface-container-lowest rounded-xl shadow-2xl p-6 text-center flex flex-col gap-4 my-auto shrink-0"
      >
        <span className="text-5xl block select-none">{emoji}</span>

        <span className="font-label-md text-xs font-bold text-primary tracking-[0.2em] uppercase block">
          {eyebrow}
        </span>

        <h1 className="text-xl sm:text-2xl font-bold text-on-background leading-snug">
          {title}
        </h1>

        <p className="text-sm text-secondary leading-relaxed px-2">
          {description}
        </p>

        <button
          onClick={() => openWhatsApp(whatsappMessage)}
          className="w-full inline-flex items-center justify-center gap-2 bg-[#25D366] text-white px-4 py-3 rounded-lg font-semibold text-sm hover:opacity-90 active:opacity-70 transition-opacity mt-2 cursor-pointer"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 32 32" fill="currentColor" className="shrink-0">
            <path d="M16 0C7.163 0 0 7.163 0 16c0 2.833.737 5.489 2.027 7.8L0 32l8.427-2.01A15.94 15.94 0 0 0 16 32c8.837 0 16-7.163 16-16S24.837 0 16 0zm0 29.333a13.27 13.27 0 0 1-6.771-1.854l-.486-.29-5.004 1.194 1.216-4.874-.317-.5A13.226 13.226 0 0 1 2.667 16C2.667 8.636 8.636 2.667 16 2.667S29.333 8.636 29.333 16 23.364 29.333 16 29.333zm7.27-9.815c-.398-.199-2.354-1.162-2.719-1.294-.365-.133-.631-.199-.897.199-.266.398-1.030.896-1.263 1.095-.232.199-.465.224-.863.025-.398-.199-1.681-.619-3.202-1.977-1.183-1.056-1.981-2.361-2.214-2.759-.232-.398-.025-.613.175-.811.18-.178.398-.465.597-.698.199-.232.265-.398.398-.664.133-.265.066-.498-.033-.697-.1-.199-.897-2.162-1.229-2.96-.324-.777-.653-.672-.897-.684l-.764-.013c-.266 0-.698.1-.1063.498-.365.398-1.396 1.362-1.396 3.325s1.429 3.856 1.628 4.122c.199.265 2.813 4.295 6.815 6.026.953.411 1.696.657 2.276.841.956.304 1.827.261 2.515.158.767-.114 2.354-.962 2.686-1.891.332-.93.332-1.727.232-1.892-.099-.164-.365-.265-.763-.464z"/>
          </svg>
          <span>{ctaLabel}</span>
        </button>

        <p className="text-xs text-on-surface-variant mt-2">
          Maria's Beauty Salon · Torreón, Coah.
        </p>
      </motion.div>
    </div>
  )
}

export default MensajeCTA