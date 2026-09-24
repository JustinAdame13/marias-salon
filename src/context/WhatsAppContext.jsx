import { createContext, useContext, useState, useEffect } from 'react'

const WhatsAppContext = createContext(null)

const WHATSAPP_NUMBER = '528713318615'
const WHATSAPP_MESSAGE = 'Hola 😊 Me gustaría agendar una cita en María’s Beauty Salon. ¿Podrían ayudarme con disponibilidad y horarios, por favor? ✨💗'
export const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`

const isMobileDevice = () =>
  /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)

export const WhatsAppProvider = ({ children }) => {
  const [showModal, setShowModal] = useState(false)
  const [activeUrl, setActiveUrl] = useState(WHATSAPP_URL)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    setIsMobile(isMobileDevice())
  }, [])

  // Ahora openWhatsApp acepta un mensaje opcional.
  // Si no se pasa nada, usa el mensaje genérico de siempre.
  const openWhatsApp = (customMessage) => {
    const url = customMessage
      ? `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(customMessage)}`
      : WHATSAPP_URL

    if (isMobile) {
      window.open(url, '_blank')
    } else {
      setActiveUrl(url)
      setShowModal(true)
    }
  }

  const closeModal = () => setShowModal(false)

  return (
    <WhatsAppContext.Provider value={{ openWhatsApp, showModal, closeModal, activeUrl }}>
      {children}
    </WhatsAppContext.Provider>
  )
}

export const useWhatsApp = () => useContext(WhatsAppContext)