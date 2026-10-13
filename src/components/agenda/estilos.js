// Clases compartidas de la agenda. Al vivir en un solo lugar, cambiar
// el look de TODAS las tarjetas o inputs es editar una línea aquí.

export const INPUT =
  'h-12 w-full rounded-2xl border border-outline-variant bg-white/80 px-4 text-base text-on-surface placeholder:text-on-surface-variant/60 focus:border-primary focus:bg-white focus:outline-none focus:ring-4 focus:ring-primary-container/70'

export const TEXTAREA =
  'w-full resize-none rounded-2xl border border-outline-variant bg-white/80 p-4 text-base focus:border-primary focus:bg-white focus:outline-none focus:ring-4 focus:ring-primary-container/70'

// card-soft está definida en index.css (vidrio ligero, sin blur)
export const CARD = 'card-soft rounded-3xl p-4'

// Botón principal: el mismo "rosa con reflejo" de la landing
export const BOTON_PRIMARIO =
  'btn-rose h-12 w-full rounded-full text-base font-semibold transition-transform active:scale-[0.98] disabled:opacity-50'

// Arriba de la barra inferior flotante (que mide ~5rem desde el borde)
export const FAB =
  'btn-rose fixed bottom-[calc(6.25rem+env(safe-area-inset-bottom))] right-4 z-30 flex h-14 items-center gap-2 rounded-full px-6 font-semibold transition-transform active:scale-95 md:bottom-8 md:right-8'

// Chips de filtro (Todas / Confirmadas / ...)
export const chipFiltro = (activo) =>
  `h-10 shrink-0 rounded-full px-4 text-sm font-semibold transition-colors ${
    activo ? 'btn-rose' : 'card-soft text-primary'
  }`

// Quita acentos y mayúsculas para buscar ("jose" encuentra "José")
export const normalizar = (s = '') =>
  s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()
