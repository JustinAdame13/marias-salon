import BottomSheet from './BottomSheet'
import { BOTON_PRIMARIO } from './estilos'

const FormSheet = ({
  title, onClose, onSubmit, guardando, error, onDelete,
  submitLabel = 'Guardar', deleteLabel = 'Eliminar', children,
}) => (
  <BottomSheet title={title} onClose={onClose}>
    <form onSubmit={onSubmit} className="flex min-h-0 flex-1 flex-col">
      <div className="flex-1 space-y-4 overflow-y-auto px-5 py-3">
        {children}
        {error && <p className="text-sm font-medium text-error">{error}</p>}
      </div>
      <div className="space-y-1 border-t border-outline-variant/70 px-5 pb-[max(1rem,env(safe-area-inset-bottom))] pt-3">
        <button
          type="submit"
          disabled={guardando}
          className={BOTON_PRIMARIO}
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