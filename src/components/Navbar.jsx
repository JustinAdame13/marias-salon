import { useWhatsApp } from '../context/WhatsAppContext'
const Navbar = () => {
  const { openWhatsApp } = useWhatsApp()
  return (
    <header className="w-full top-0 sticky z-50 bg-surface/80 backdrop-blur-md">
      <nav className="max-w-container-max mx-auto px-md py-sm flex justify-between items-center">
        
        {/* Logo / Nombre del salón */}
        <span className="font-headline-md text-2xl text-primary tracking-widest uppercase">
          Maria's
        </span>

        {/* Links de navegación — ocultos en móvil */}
        <div className="hidden md:flex gap-lg">
          <a href="#services" className="font-body-md text-on-surface-variant hover:text-primary transition-colors duration-300">
            Servicios
          </a>
          <a href="#about" className="font-body-md text-on-surface-variant hover:text-primary transition-colors duration-300">
            Estilista
          </a>
          <a href="#location" className="font-body-md text-on-surface-variant hover:text-primary transition-colors duration-300">
            Ubicación
          </a>
        </div>

        {/* Botón CTA */}
        <button onClick={openWhatsApp} className="bg-primary text-on-primary px-md py-sm rounded-sm font-label-md hover:opacity-90 transition-opacity active:opacity-70">
          Reservar Cita
        </button>

      </nav>
    </header>
  )
}

export default Navbar