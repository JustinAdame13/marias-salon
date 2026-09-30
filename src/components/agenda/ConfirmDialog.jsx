import BottomSheet from './BottomSheet'

const ConfirmDialog = ({ title, message, onConfirm, onCancel, confirmLabel = 'Eliminar' }) => (
  <BottomSheet title={title} onClose={onCancel}>
    <div className="space-y-4 px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-1">
      <p className="text-secondary">{message}</p>
      <div className="grid gap-2">
        <button onClick={onConfirm} className="h-12 rounded-xl bg-error text-base font-semibold text-on-error">
          {confirmLabel}
        </button>
        <button onClick={onCancel} className="h-12 rounded-xl bg-primary-container text-base font-semibold text-primary">
          Cancelar
        </button>
      </div>
    </div>
  </BottomSheet>
)

export default ConfirmDialog