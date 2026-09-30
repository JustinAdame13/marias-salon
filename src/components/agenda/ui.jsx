import Icon from './Icon'
import { INPUT } from './estilos'

export const Campo = ({ label, children }) => (
  <label className="flex flex-col gap-1.5">
    <span className="text-[11px] font-semibold uppercase tracking-wider text-secondary">{label}</span>
    {children}
  </label>
)

// Título de página: en móvil ya lo muestra el encabezado, por eso solo aparece en escritorio
export const Titulo = ({ children }) => (
  <h1 className="mb-6 hidden font-headline-md text-3xl text-primary md:block shrink-0">{children}</h1>
)

export const SearchInput = ({ value, onChange, placeholder = 'Buscar...' }) => (
  <input
    type="search"
    value={value}
    onChange={(e) => onChange(e.target.value)}
    placeholder={placeholder}
    className={`${INPUT} mb-4`}
  />
)

const TONOS = {
  primary: 'bg-[#f5eae8] text-[#7d484e]',
  sage: 'bg-[#e3ebdc] text-[#4d5a34]',
  sand: 'bg-[#efe6df] text-[#8c6c70]',
  error: 'bg-error-container text-on-error-container',
}

export const Chip = ({ tono = 'primary', children }) => (
  <span
    className={`inline-flex items-center rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider ${TONOS[tono]}`}
  >
    {children}
  </span>
)

export const Avatar = ({ nombre = '?' }) => (
  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-primary-container font-bold text-primary">
    {nombre.charAt(0).toUpperCase()}
  </span>
)

export const Aviso = ({ children }) => (
  <p className="py-10 text-center text-secondary">{children}</p>
)

export const ErrorBanner = ({ children }) => (
  <div className="mb-4 rounded-xl bg-error-container px-4 py-3 text-sm text-on-error-container">{children}</div>
)

export const Fab = ({ onClick, children }) => (
  <button
    onClick={onClick}
    className="fixed bottom-[calc(5rem+env(safe-area-inset-bottom))] right-4 z-30 flex h-14 items-center gap-2 rounded-full bg-primary px-6 font-semibold text-on-primary shadow-[0_6px_20px_rgba(125,72,78,0.35)] active:bg-[#663a40] md:bottom-8 md:right-8"
  >
    <Icon name="plus" className="h-5 w-5" />
    {children}
  </button>
)