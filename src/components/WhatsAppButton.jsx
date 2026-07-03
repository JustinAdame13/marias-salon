import { QRCodeSVG } from 'qrcode.react'
import { useWhatsApp, WHATSAPP_URL } from '../context/WhatsAppContext'

const QRModal = ({ onClose }) => {
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) onClose()
  }

  return (
    <div
      onClick={handleBackdropClick}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
    >
      <div className="bg-surface-container-lowest rounded-lg shadow-2xl p-lg flex flex-col items-center gap-md w-80 mx-md">
        <button
          onClick={onClose}
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
          <QRCodeSVG
            value={WHATSAPP_URL}
            size={180}
            fgColor="#7c5454"
            bgColor="#ffffff"
          />
        </div>
        <p className="font-label-sm text-label-sm text-on-surface-variant text-center">
          Maria's Beauty Salon · Torreón, Coah.
        </p>
      </div>
    </div>
  )
}

const WhatsAppButton = () => {
  const { openWhatsApp, showModal, closeModal } = useWhatsApp()

  return (
    <>
      <button
        onClick={openWhatsApp}
        aria-label="Contactar por WhatsApp"
        className="fixed bottom-gutter right-gutter z-50 bg-[#25D366] text-white p-md rounded-full shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 32 32" fill="currentColor">
          <path d="M16 0C7.163 0 0 7.163 0 16c0 2.833.737 5.489 2.027 7.8L0 32l8.427-2.01A15.94 15.94 0 0 0 16 32c8.837 0 16-7.163 16-16S24.837 0 16 0zm0 29.333a13.27 13.27 0 0 1-6.771-1.854l-.486-.29-5.004 1.194 1.216-4.874-.317-.5A13.226 13.226 0 0 1 2.667 16C2.667 8.636 8.636 2.667 16 2.667S29.333 8.636 29.333 16 23.364 29.333 16 29.333zm7.27-9.815c-.398-.199-2.354-1.162-2.719-1.294-.365-.133-.631-.199-.897.199-.266.398-1.030.896-1.263 1.095-.232.199-.465.224-.863.025-.398-.199-1.681-.619-3.202-1.977-1.183-1.056-1.981-2.361-2.214-2.759-.232-.398-.025-.613.175-.811.18-.178.398-.465.597-.698.199-.232.265-.398.398-.664.133-.265.066-.498-.033-.697-.1-.199-.897-2.162-1.229-2.96-.324-.777-.653-.672-.897-.684l-.764-.013c-.266 0-.698.1-.1063.498-.365.398-1.396 1.362-1.396 3.325s1.429 3.856 1.628 4.122c.199.265 2.813 4.295 6.815 6.026.953.411 1.696.657 2.276.841.956.304 1.827.261 2.515.158.767-.114 2.354-.962 2.686-1.891.332-.93.332-1.727.232-1.892-.099-.164-.365-.265-.763-.464z"/>
        </svg>
      </button>

      {showModal && <QRModal onClose={closeModal} />}
    </>
  )
}

export default WhatsAppButton