const ConfirmDialog = ({ title, message, onConfirm, onCancel }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
    <div className="bg-surface-container-lowest rounded-lg shadow-2xl p-lg w-full max-w-sm flex flex-col gap-md">
      <h3 className="font-headline-md text-lg text-primary">{title}</h3>
      <p className="text-sm text-secondary">{message}</p>
      <div className="flex justify-end gap-sm mt-sm">
        <button onClick={onCancel} className="px-md py-sm text-secondary hover:text-primary">
          Cancelar
        </button>
        <button
          onClick={onConfirm}
          className="bg-error text-on-error px-lg py-sm rounded-sm hover:opacity-90"
        >
          Eliminar
        </button>
      </div>
    </div>
  </div>
)

export default ConfirmDialog