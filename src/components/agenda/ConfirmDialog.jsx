import BottomSheet from './BottomSheet'

const ConfirmDialog = ({ title, message, onConfirm, onCancel, confirmLabel = 'Eliminar' }) => (
  <BottomSheet title={title} onClose={onCancel}>
    <div className="space-y-4 px-5 pb-[max(1rem,env(safe-area-inset-bottom))] pt-1">
      <p className="text-secondary">{message}</p>
      <div className="grid gap-2">
        <button onClick={onConfirm} className="h-12 rounded-full bg-error text-base font-semibold text-on-error transition-transform active:scale-[0.98]">
          {confirmLabel}
        </button>
        <button onClick={onCancel} className="card-soft h-12 rounded-full text-base font-semibold text-primary">
          Cancelar
        </button>
      </div>
    </div>
  </BottomSheet>
)

export default ConfirmDialog