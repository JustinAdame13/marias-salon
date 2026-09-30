export const INPUT =
  'h-12 w-full rounded-xl border border-outline-variant bg-white px-3 text-base text-on-surface focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary-container/60'

export const TEXTAREA =
  'w-full resize-none rounded-xl border border-outline-variant bg-white p-3 text-base focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary-container/60'

export const CARD =
  'rounded-2xl border border-outline-variant bg-white p-4 shadow-[0_2px_10px_rgba(125,72,78,0.04)]'

// Quita acentos y mayúsculas para buscar ("jose" encuentra "José")
export const normalizar = (s = '') =>
  s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()