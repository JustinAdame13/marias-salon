import { useState } from 'react'
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'
import { useAgendaAuth } from '../../context/AgendaAuthContext'
import BottomSheet from './BottomSheet'
import Icon from './Icon'

const TODOS = ['ADMIN', 'JEFA', 'EMPLEADA']

const NAV_ITEMS = [
  { to: '/agenda', label: 'Inicio', icon: 'home', roles: TODOS, primaria: true, end: true },
  { to: '/agenda/citas', label: 'Citas', icon: 'calendar', roles: TODOS, primaria: true },
  { to: '/agenda/clientas', label: 'Clientas', icon: 'users', roles: TODOS, primaria: true },
  { to: '/agenda/mensajes', label: 'Mensajes', icon: 'chat', roles: ['ADMIN'], primaria: true },
  { to: '/agenda/estadisticas', label: 'Estadísticas', icon: 'chart', roles: ['ADMIN', 'JEFA'] },
  { to: '/agenda/servicios', label: 'Servicios', icon: 'tag', roles: TODOS },
  { to: '/agenda/empleadas', label: 'Empleadas', icon: 'user', roles: ['ADMIN'] },
  { to: '/agenda/plantillas', label: 'Plantillas', icon: 'doc', roles: ['ADMIN'] },
  { to: '/agenda/usuarios', label: 'Usuarios', icon: 'lock', roles: ['ADMIN'] },
]

const AgendaLayout = () => {
  const { user, logout } = useAgendaAuth()
  const { pathname } = useLocation()
  const [menuAbierto, setMenuAbierto] = useState(false)

  const visibles = NAV_ITEMS.filter((i) => i.roles.includes(user?.rol))
  const primarias = visibles.filter((i) => i.primaria)
  const secundarias = visibles.filter((i) => !i.primaria)
  const ruta = pathname.replace(/\/+$/, '') // "/agenda/" → "/agenda"
  const seccionActual = visibles.find((i) =>
    i.end ? ruta === i.to : ruta.startsWith(i.to)
  )?.label
  const menuActivo = secundarias.some((i) => pathname.startsWith(i.to))
  const inicial = (user?.username || '?').charAt(0).toUpperCase()

  return (
    <div className="agenda-theme min-h-screen">
      {/* Mismas manchas de color que la landing: el vidrio necesita algo detrás */}
      <div aria-hidden className="agenda-ambient" />

      {/* Barra lateral (escritorio): un panel de vidrio flotante */}
      <aside className="glass fixed inset-y-3 left-3 z-30 hidden w-60 flex-col rounded-[2rem] p-5 md:flex">
        <div className="mb-8 px-1">
          <img src="/logo-marias.png" alt="Maria's Beauty Salon" width="640" height="206" className="h-11 w-auto" />
          <div className="mt-3 flex items-center gap-2">
            <div className="h-px flex-1 gold-rule" />
            <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-gold-ink">Agenda</p>
            <div className="h-px flex-1 gold-rule" />
          </div>
        </div>
        <nav className="flex flex-1 flex-col gap-1">
          {visibles.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `flex h-11 items-center gap-3 rounded-full px-4 text-sm transition-colors ${
                  isActive
                    ? 'bg-white/80 font-semibold text-primary shadow-sm'
                    : 'font-medium text-on-surface-variant hover:bg-white/50 hover:text-primary'
                }`
              }
            >
              <Icon name={item.icon} className="h-5 w-5" />
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="pt-4">
          <div className="mb-3 gold-rule" />
          <div className="mb-2 flex items-center gap-3 px-1">
            <span className="grid size-10 shrink-0 place-items-center rounded-full bg-primary-container font-['Bodoni_Moda'] text-lg text-primary ring-2 ring-white/80">
              {inicial}
            </span>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold">{user?.username}</p>
              <p className="text-[10px] font-semibold uppercase tracking-wider text-gold-ink">{user?.rol}</p>
            </div>
          </div>
          <button
            onClick={logout}
            className="flex h-11 w-full items-center gap-3 rounded-full px-4 text-sm font-medium text-on-surface-variant hover:bg-white/50 hover:text-primary"
          >
            <Icon name="logout" className="h-5 w-5" />
            Cerrar sesión
          </button>
        </div>
      </aside>

      <div className="md:pl-64">
        {/* Encabezado (móvil): la misma "píldora de vidrio" del Navbar de la landing */}
        <header className="sticky top-0 z-30 bg-gradient-to-b from-background via-background/70 to-transparent px-3 pb-2 pt-[max(0.75rem,env(safe-area-inset-top))] md:hidden">
          <div className="glass flex items-center justify-between gap-2 rounded-full py-1.5 pl-4 pr-1.5">
            <div className="flex min-w-0 items-center gap-2.5">
              <img src="/logo-marias.png" alt="Maria's" width="640" height="206" className="h-8 w-auto shrink-0" />
              <span className="h-5 w-px shrink-0 bg-gold/50" />
              <p className="truncate font-['Bodoni_Moda'] text-base italic text-primary">{seccionActual}</p>
            </div>
            <div className="relative shrink-0">
              <div className="grid size-10 place-items-center rounded-full bg-primary-container font-['Bodoni_Moda'] text-lg text-primary ring-2 ring-white/80">
                {inicial}
              </div>
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 rounded-full bg-gold-ink px-1.5 py-px text-[8px] font-bold tracking-wider text-white">
                {user?.rol}
              </span>
            </div>
          </div>
        </header>

        <main className="mx-auto w-full max-w-3xl px-4 pb-32 pt-3 md:px-8 md:pb-12 md:pt-10">
          <Outlet />
        </main>
      </div>

      {/* Barra inferior (móvil): píldora flotante igual a MobileTabBar de la landing */}
      <nav className="glass glass-strong fixed inset-x-3 bottom-[calc(env(safe-area-inset-bottom)+0.75rem)] z-40 rounded-full p-1.5 md:hidden">
        <ul className="flex items-stretch gap-1">
          {primarias.map((item) => (
            <li key={item.to} className="flex-1">
              <NavLink
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `flex h-14 flex-col items-center justify-center gap-0.5 rounded-full text-[0.68rem] transition-colors ${
                    isActive ? 'bg-white/80 font-semibold text-primary shadow-sm' : 'font-medium text-on-surface-variant'
                  }`
                }
              >
                <Icon name={item.icon} className="h-5 w-5" />
                <span>{item.label}</span>
              </NavLink>
            </li>
          ))}
          <li className="flex-1">
            <button
              onClick={() => setMenuAbierto(true)}
              className={`flex h-14 w-full flex-col items-center justify-center gap-0.5 rounded-full text-[0.68rem] transition-colors ${
                menuActivo ? 'bg-white/80 font-semibold text-primary shadow-sm' : 'font-medium text-on-surface-variant'
              }`}
            >
              <Icon name="grid" className="h-5 w-5" />
              <span>Menú</span>
            </button>
          </li>
        </ul>
      </nav>

      {menuAbierto && (
        <BottomSheet title="Menú" onClose={() => setMenuAbierto(false)}>
          <div className="space-y-1 overflow-y-auto p-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
            {secundarias.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setMenuAbierto(false)}
                className={`flex h-12 items-center gap-3 rounded-full px-4 text-base font-medium transition-colors ${
                  pathname.startsWith(item.to) ? 'bg-primary-container text-primary' : 'hover:bg-surface-container'
                }`}
              >
                <Icon name={item.icon} className="h-5 w-5 text-primary" />
                {item.label}
              </Link>
            ))}
            <div className="my-3 gold-rule" />
            <p className="px-4 text-xs text-secondary">
              {user?.username} · {user?.rol}
            </p>
            <button
              onClick={logout}
              className="flex h-12 w-full items-center gap-3 rounded-full px-4 text-base font-medium text-error hover:bg-surface-container"
            >
              <Icon name="logout" className="h-5 w-5" />
              Cerrar sesión
            </button>
          </div>
        </BottomSheet>
      )}
    </div>
  )
}

export default AgendaLayout