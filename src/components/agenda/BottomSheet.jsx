import { useEffect } from 'react'
import Icon from './Icon'

const BottomSheet = ({ title, onClose, children }) => {
  useEffect(() => {
    const alPresionar = (e) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', alPresionar)
    const previo = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', alPresionar)
      document.body.style.overflow = previo
    }
  }, [onClose])

  return (
    <div
      onClick={(e) => e.target === e.currentTarget && onClose()}
      className="fixed inset-0 z-50 flex items-end justify-center bg-[#3d2f30]/30 backdrop-blur-[3px] md:items-center md:p-6"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className="animate-sheet relative flex max-h-[92vh] w-full flex-col rounded-t-[2rem] border border-white/80 bg-gradient-to-b from-[#fffaf8] to-background shadow-[0_-12px_40px_-12px_rgba(110,58,66,0.35)] md:max-w-[32rem] md:rounded-[2rem]"
      >
        {/* "Agarradera": pista visual de que es una hoja que sube desde abajo */}
        <span aria-hidden className="mx-auto mt-2.5 h-1 w-10 shrink-0 rounded-full bg-outline-variant md:hidden" />
        <div className="flex shrink-0 items-center justify-between px-5 pb-2 pt-3">
          <div>
            <h2 className="font-headline-md text-2xl text-on-background">{title}</h2>
            <div className="mt-1.5 w-12 gold-rule" />
          </div>
          <button
            onClick={onClose}
            aria-label="Cerrar"
            className="grid h-11 w-11 place-items-center rounded-full text-secondary hover:bg-white/70"
          >
            <Icon name="close" className="h-5 w-5" />
          </button>
        </div>
        <div className="flex min-h-0 flex-1 flex-col">{children}</div>
      </div>
    </div>
  )
}

export default BottomSheet