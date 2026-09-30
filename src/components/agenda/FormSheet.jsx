import BottomSheet from './BottomSheet'

const FormSheet = ({
  title, onClose, onSubmit, guardando, error, onDelete,
  submitLabel = 'Guardar', deleteLabel = 'Eliminar', children,
}) => (
  <BottomSheet title={title} onClose={onClose}>
    <form onSubmit={onSubmit} className="flex min-h-0 flex-1 flex-col">
      <div className="flex-1 space-y-4 overflow-y-auto px-4 py-3">
        {children}
        {error && <p className="text-sm font-medium text-error">{error}</p>}
      </div>
      <div className="space-y-1 border-t border-outline-variant px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-3">
        <button
          type="submit"
          disabled={guardando}
          className="h-12 w-full rounded-xl bg-primary text-base font-semibold text-on-primary active:bg-[#663a40] disabled:opacity-50"
        >
          {guardando ? 'Guardando...' : submitLabel}
        </button>
        {onDelete && (
          <button type="button" onClick={onDelete} className="h-11 w-full text-sm font-semibold text-error">
            {deleteLabel}
          </button>
        )}
      </div>
    </form>
  </BottomSheet>
)

export default FormSheet