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
      className="fixed inset-0 z-[60] flex items-center justify-center bg-[#3d2f30]/30 p-4 backdrop-blur-md"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="wa-modal-title"
        className="glass glass-strong flex w-full max-w-[21rem] flex-col items-center gap-4 rounded-[2rem] p-6"
      >
        <button
          type="button"
          onClick={closeModal}
          className="grid size-9 place-items-center self-end rounded-full text-lg leading-none text-[#6b5a5a] transition-colors hover:bg-white/70 hover:text-[#9c5560]"
          aria-label="Cerrar"
        >
          ✕
        </button>
        <h3 id="wa-modal-title" className="-mt-4 text-center font-['Bodoni_Moda'] text-3xl text-[#9c5560]">
          Agenda tu cita
        </h3>
        <p className="text-center font-body-md text-sm text-[#6b5a5a]">
          Escanea el código con tu teléfono para abrir WhatsApp
        </p>
        <div className="rounded-2xl bg-white p-3 shadow-sm">
          <QRCodeSVG value={activeUrl} size={180} fgColor="#9c5560" bgColor="#ffffff" />
        </div>
        <a
          href={activeUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="font-label-md text-sm text-[#9c5560] underline underline-offset-4"
        >
          o abrir WhatsApp Web
        </a>
        <p className="font-label-sm text-xs text-[#6b5a5a]">Maria's Beauty Salon · Torreón, Coah.</p>
      </div>
    </div>
  )
}

export default WhatsAppModal
