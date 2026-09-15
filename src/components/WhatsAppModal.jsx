import { QRCodeSVG } from 'qrcode.react'
import { useWhatsApp } from '../context/WhatsAppContext'

const WhatsAppModal = () => {
  const { showModal, closeModal, activeUrl } = useWhatsApp()

  if (!showModal) return null

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) closeModal()
  }

  return (
    <div
      onClick={handleBackdropClick}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
    >
      <div className="bg-surface-container-lowest rounded-lg shadow-2xl p-lg flex flex-col items-center gap-md w-80 mx-md">
        <button
          onClick={closeModal}
          className="self-end text-on-surface-variant hover:text-primary transition-colors text-xl leading-none"
          aria-label="Cerrar"
        >
          ✕
        </button>
        <h3 className="font-headline-md text-headline-md text-primary text-center">
          Agenda tu cita
        </h3>
        <p className="font-body-md text-body-md text-secondary text-center">
          Escanea el código con tu teléfono para abrir WhatsApp
        </p>
        <div className="p-base bg-white rounded-sm">
          <QRCodeSVG value={activeUrl} size={180} fgColor="#7c5454" bgColor="#ffffff" />
        </div>
        <p className="font-label-sm text-label-sm text-on-surface-variant text-center">
          Maria's Beauty Salon · Torreón, Coah.
        </p>
      </div>
    </div>
  )
}

export default WhatsAppModal