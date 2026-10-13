import { useWhatsApp } from '../context/WhatsAppContext'
import { WhatsAppIcon } from './icons'

// Botón flotante — solo en tablet/desktop (hidden md:flex).
// En móvil su función la cumple el botón "Reservar" de la barra inferior.
const WhatsAppButton = () => {
  const { openWhatsApp } = useWhatsApp()

  return (
    <button
      type="button"
      onClick={() => openWhatsApp()}
      aria-label="Contactar por WhatsApp"
      className="fixed bottom-6 right-6 z-50 hidden size-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_12px_30px_-8px_rgb(37_211_102/0.6)] ring-4 ring-white/60 transition-transform hover:scale-110 active:scale-95 md:flex"
    >
      <WhatsAppIcon size={28} />
    </button>
  )
}

export default WhatsAppButton
