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
      className="fixed inset-0 z-50 flex items-end justify-center bg-[#301b20]/35 backdrop-blur-sm md:items-center md:p-6"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className="animate-sheet flex max-h-[92vh] w-full flex-col rounded-t-3xl bg-surface-container-lowest shadow-[0_-4px_30px_rgba(48,27,32,0.12)] md:max-w-[32rem] md:rounded-3xl"
      >
        <div className="flex shrink-0 items-center justify-between px-4 pb-2 pt-4">
          <h2 className="font-headline-md text-xl text-primary">{title}</h2>
          <button
            onClick={onClose}
            aria-label="Cerrar"
            className="grid h-11 w-11 place-items-center rounded-full text-secondary hover:bg-surface-container"
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