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
  const seccionActual = visibles.find((i) =>
    i.end ? pathname === i.to : pathname.startsWith(i.to)
  )?.label
  const menuActivo = secundarias.some((i) => pathname.startsWith(i.to))
  const inicial = (user?.username || '?').charAt(0).toUpperCase()

  return (
    <div className="agenda-theme min-h-screen bg-background">
      {/* Barra lateral (escritorio) */}
      <aside className="fixed inset-y-0 left-0 hidden w-64 flex-col border-r border-outline-variant bg-white p-5 md:flex">
        <div className="mb-8">
          <p className="font-headline-md text-2xl text-primary">Maria's</p>
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-secondary">Agenda</p>
        </div>
        <nav className="flex flex-1 flex-col gap-1">
          {visibles.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `flex h-11 items-center gap-3 rounded-xl px-3 text-sm transition-colors ${
                  isActive
                    ? 'bg-primary-container font-bold text-primary'
                    : 'font-medium text-secondary hover:bg-surface-container'
                }`
              }
            >
              <Icon name={item.icon} className="h-5 w-5" />
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="border-t border-outline-variant pt-4">
          <p className="truncate text-sm font-semibold">{user?.username}</p>
          <p className="mb-3 text-xs text-secondary">{user?.rol}</p>
          <button
            onClick={logout}
            className="flex h-11 w-full items-center gap-3 rounded-xl px-3 text-sm font-medium text-secondary hover:bg-surface-container"
          >
            <Icon name="logout" className="h-5 w-5" />
            Cerrar sesión
          </button>
        </div>
      </aside>

      <div className="md:pl-64">
        {/* Encabezado (móvil) */}
        <header className="sticky top-0 z-30 flex items-center justify-between border-b border-outline-variant/60 bg-background/90 px-4 pb-2 pt-[max(0.5rem,env(safe-area-inset-top))] backdrop-blur-md md:hidden">
          <div className="min-w-0">
            <p className="font-headline-md text-xl sm:text-2xl leading-none text-primary truncate">Maria's Agenda</p>
            <p className="mt-1 text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.15em] text-secondary truncate">
              {seccionActual}
            </p>
          </div>
          <div className="relative shrink-0 ml-2">
            <div className="grid h-10 w-10 sm:h-11 sm:w-11 place-items-center rounded-full bg-primary-container font-bold text-primary">
              {inicial}
            </div>
            <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 rounded-full bg-primary px-1.5 sm:px-2 py-px text-[8px] sm:text-[9px] font-bold tracking-wider text-white">
              {user?.rol}
            </span>
          </div>
        </header>

        <main className="mx-auto w-full max-w-3xl px-4 pb-28 pt-4 md:px-8 md:pb-12 md:pt-8">
          <Outlet />
        </main>
      </div>

      {/* Barra inferior (móvil) */}
      <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-outline-variant bg-background/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-lg md:hidden">
        <ul className="flex h-16 items-stretch">
          {primarias.map((item) => (
            <li key={item.to} className="flex-1">
              <NavLink
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `flex h-full flex-col items-center justify-center gap-0.5 text-[11px] ${
                    isActive ? 'font-bold text-primary' : 'font-medium text-secondary'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon name={item.icon} className="h-6 w-6" />
                    <span>{item.label}</span>
                    <span className={`h-1 w-1 rounded-full ${isActive ? 'bg-primary' : 'bg-transparent'}`} />
                  </>
                )}
              </NavLink>
            </li>
          ))}
          <li className="flex-1">
            <button
              onClick={() => setMenuAbierto(true)}
              className={`flex h-full w-full flex-col items-center justify-center gap-0.5 text-[11px] ${
                menuActivo ? 'font-bold text-primary' : 'font-medium text-secondary'
              }`}
            >
              <Icon name="grid" className="h-6 w-6" />
              <span>Menú</span>
              <span className={`h-1 w-1 rounded-full ${menuActivo ? 'bg-primary' : 'bg-transparent'}`} />
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
                className="flex h-12 items-center gap-3 rounded-xl px-3 text-base font-medium hover:bg-surface-container"
              >
                <Icon name={item.icon} className="h-5 w-5 text-primary" />
                {item.label}
              </Link>
            ))}
            <div className="my-2 border-t border-outline-variant" />
            <p className="px-3 text-xs text-secondary">
              {user?.username} · {user?.rol}
            </p>
            <button
              onClick={logout}
              className="flex h-12 w-full items-center gap-3 rounded-xl px-3 text-base font-medium text-error hover:bg-surface-container"
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