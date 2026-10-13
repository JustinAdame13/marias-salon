import { useWhatsApp } from '../context/WhatsAppContext'
import useActiveSection from '../hooks/useActiveSection'
import { PinIcon, ScissorsIcon, UserIcon, WhatsAppIcon } from './icons'

// Barra inferior estilo app (solo móvil: md:hidden).
// En el celular el pulgar llega fácil a la parte de abajo de la pantalla,
// por eso la navegación y el botón de reservar viven aquí.
const TABS = [
  { id: 'services', label: 'Servicios', Icon: ScissorsIcon },
  { id: 'about', label: 'Estilista', Icon: UserIcon },
  { id: 'location', label: 'Ubicación', Icon: PinIcon },
]

const MobileTabBar = () => {
  const { openWhatsApp } = useWhatsApp()
  const active = useActiveSection(TABS.map((t) => t.id))

  return (
    <nav
      aria-label="Navegación rápida"
      // env(safe-area-inset-bottom) = espacio de la "barrita" del iPhone.
      // Funciona porque index.html tiene viewport-fit=cover.
      className="glass glass-strong fixed inset-x-3 bottom-[calc(env(safe-area-inset-bottom)+0.75rem)] z-50 flex items-center gap-1 rounded-full p-1.5 md:hidden"
    >
      {TABS.map(({ id, label, Icon }) => {
        const isActive = active === id
        return (
          <a
            key={id}
            href={`#${id}`}
            aria-current={isActive ? 'true' : undefined}
            className={`flex h-14 flex-1 flex-col items-center justify-center gap-0.5 rounded-full font-label-sm text-[0.68rem] font-medium transition-colors ${
              isActive ? 'bg-white/80 text-primary shadow-sm' : 'text-on-surface-variant'
            }`}
          >
            <Icon size={20} />
            {label}
          </a>
        )
      })}

      <button
        type="button"
        onClick={() => openWhatsApp()}
        className="btn-rose flex h-14 flex-[1.35] items-center justify-center gap-1.5 rounded-full px-3 font-label-md text-sm font-semibold active:scale-[0.97]"
      >
        <WhatsAppIcon size={18} />
        Reservar
      </button>
    </nav>
  )
}

export default MobileTabBar
