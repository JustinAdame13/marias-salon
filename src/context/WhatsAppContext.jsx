import { createContext, useContext, useState, useEffect } from 'react'

const WhatsAppContext = createContext(null)

const WHATSAPP_NUMBER = '528713318615'
const WHATSAPP_MESSAGE = '¡Hola! 😊 Quiero apartar mi lugar como una de las primeras 5 personas para recibir el laminado y perfilado de cejas GRATIS. ¿Podemos agendar una cita?'
export const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`

const isMobileDevice = () =>
  /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)

export const WhatsAppProvider = ({ children }) => {
  const [showModal, setShowModal] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    setIsMobile(isMobileDevice())
  }, [])

  const openWhatsApp = () => {
    if (isMobile) {
      window.open(WHATSAPP_URL, '_blank')
    } else {
      setShowModal(true)
    }
  }

  const closeModal = () => setShowModal(false)

  return (
    <WhatsAppContext.Provider value={{ openWhatsApp, showModal, closeModal }}>
      {children}
    </WhatsAppContext.Provider>
  )
}

// Hook personalizado — cualquier componente llama useWhatsApp()
// y obtiene { openWhatsApp } sin saber nada del Context internamente
export const useWhatsApp = () => useContext(WhatsAppContext)