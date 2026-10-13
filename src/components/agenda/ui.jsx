import Icon from './Icon'
import { INPUT, FAB } from './estilos'

export const Campo = ({ label, children }) => (
  <label className="flex flex-col gap-1.5">
    <span className="text-[11px] font-semibold uppercase tracking-wider text-secondary">{label}</span>
    {children}
  </label>
)

// Título de página: en móvil ya lo muestra el encabezado, por eso solo aparece en escritorio
export const Titulo = ({ children }) => (
  <div className="mb-6 hidden shrink-0 md:block">
    <h1 className="font-headline-md text-4xl text-on-background">{children}</h1>
    <div className="mt-3 w-20 gold-rule" />
  </div>
)

// Etiqueta pequeña tipo "píldora de vidrio" con punto dorado (como en el Hero)
export const Eyebrow = ({ children }) => (
  <span className="glass inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs tracking-wide text-on-surface-variant">
    <span className="size-1.5 rounded-full bg-gold" />
    {children}
  </span>
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
  primary: 'bg-primary-container text-on-primary-container',
  sage: 'bg-[#e6eddf] text-[#4d5a34]', // verde = "listo", se queda fijo a propósito
  sand: 'bg-surface-container-high text-on-surface-variant',
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
  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-primary-container font-['Bodoni_Moda'] text-lg text-primary ring-2 ring-white/80">
    {nombre.charAt(0).toUpperCase()}
  </span>
)

export const Aviso = ({ children }) => (
  <p className="py-10 text-center text-secondary">{children}</p>
)

export const ErrorBanner = ({ children }) => (
  <div className="mb-4 rounded-2xl bg-error-container px-4 py-3 text-sm text-on-error-container">{children}</div>
)

export const Fab = ({ onClick, children }) => (
  <button
    onClick={onClick}
    className={FAB}
  >
    <Icon name="plus" className="h-5 w-5" />
    {children}
  </button>
)