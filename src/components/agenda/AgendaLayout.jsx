import { Link, Outlet, useLocation } from 'react-router-dom'
import { useAgendaAuth } from '../../context/AgendaAuthContext'

const NAV_ITEMS = [
  { to: '/agenda', label: 'Inicio', roles: ['ADMIN', 'JEFA', 'EMPLEADA'] },
  { to: '/agenda/citas', label: 'Citas', roles: ['ADMIN', 'JEFA', 'EMPLEADA'] },
  { to: '/agenda/clientas', label: 'Clientas', roles: ['ADMIN', 'JEFA', 'EMPLEADA'] },
  { to: '/agenda/servicios', label: 'Servicios', roles: ['ADMIN', 'JEFA', 'EMPLEADA'] },
  { to: '/agenda/empleadas', label: 'Empleadas', roles: ['ADMIN'] },
  { to: '/agenda/plantillas', label: 'Plantillas', roles: ['ADMIN'] },
  { to: '/agenda/mensajes', label: 'Mensajes', roles: ['ADMIN'] },
  { to: '/agenda/usuarios', label: 'Usuarios', roles: ['ADMIN'] },
]

const AgendaLayout = () => {
  const { user, logout } = useAgendaAuth()
  const location = useLocation()

  const visibleItems = NAV_ITEMS.filter((item) => item.roles.includes(user?.rol))

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="bg-surface-container-lowest border-b border-outline-variant/20 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-md py-sm flex items-center justify-between">
          <span className="font-headline-md text-lg sm:text-xl text-primary tracking-wide">
            Maria's · Agenda
          </span>
          <div className="flex items-center gap-sm sm:gap-md">
            <span className="text-xs sm:text-sm text-secondary hidden sm:inline">
              {user?.username} · {user?.rol}
            </span>
            <button
              onClick={logout}
              className="text-xs sm:text-sm text-secondary hover:text-primary underline whitespace-nowrap"
            >
              Cerrar sesión
            </button>
          </div>
        </div>
        <nav className="max-w-6xl mx-auto px-md flex gap-2 sm:gap-lg overflow-x-auto pb-2 sm:pb-0">
          {visibleItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className={`py-sm px-2 sm:px-0 text-xs sm:text-sm whitespace-nowrap border-b-2 transition-colors flex-shrink-0 ${
                location.pathname === item.to
                  ? 'border-primary text-primary font-medium'
                  : 'border-transparent text-secondary hover:text-primary'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </header>

      <main className="flex-1 max-w-6xl mx-auto w-full px-md py-4 sm:py-lg">
        <Outlet />
      </main>
    </div>
  )
}

export default AgendaLayout