import { useEffect, useState } from 'react'
import { useWhatsApp } from '../context/WhatsAppContext'
import useActiveSection from '../hooks/useActiveSection'
import { InstagramIcon, FacebookIcon } from './icons'

const NAV_LINKS = [
  { id: 'services', label: 'Servicios' },
  { id: 'about', label: 'Estilista' },
  { id: 'location', label: 'Ubicación' },
]

const SOCIALS = [
  { href: 'https://www.instagram.com/mariassbeautysalon/', label: 'Instagram', Icon: InstagramIcon },
  { href: 'https://www.facebook.com/lupita.Garcia.Renteria.7', label: 'Facebook', Icon: FacebookIcon },
]

const Navbar = () => {
  const { openWhatsApp } = useWhatsApp()
  const active = useActiveSection(NAV_LINKS.map((l) => l.id))

  // Al hacer scroll la "píldora" se vuelve más opaca y compacta
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    // En este proyecto quien hace scroll es <body> (por height:100% +
    // overflow-x:hidden en index.css), no window. Por eso leemos ambos y
    // escuchamos en fase de captura: el evento scroll no "burbujea".
    const onScroll = () =>
      setScrolled(Math.max(window.scrollY, document.body.scrollTop) > 12)
    onScroll()
    document.addEventListener('scroll', onScroll, { passive: true, capture: true })
    return () => document.removeEventListener('scroll', onScroll, { capture: true })
  }, [])

  return (
    <header className="sticky top-0 z-50 bg-gradient-to-b from-background via-background/70 to-transparent pb-2 px-3 pt-[max(0.75rem,env(safe-area-inset-top))] sm:px-md">
      <nav
        aria-label="Principal"
        className={`glass mx-auto flex max-w-container-max items-center justify-between rounded-full pl-4 pr-2 transition-all duration-300 sm:pl-6 ${
          scrolled ? 'glass-strong py-1.5' : 'py-2'
        }`}
      >
        <a href="#inicio" aria-label="Maria's Beauty Salon — inicio" className="shrink-0">
          <img
            src="/logo-marias.png"
            alt="Maria's Beauty Salon"
            width="640"
            height="206"
            className={`w-auto transition-all duration-300 ${scrolled ? 'h-8 sm:h-9' : 'h-9 sm:h-11'}`}
          />
        </a>

        {/* Links: solo desktop. En móvil se usan desde la barra inferior */}
        <ul className="hidden items-center gap-1 md:flex">
          {NAV_LINKS.map(({ id, label }) => (
            <li key={id}>
              <a
                href={`#${id}`}
                aria-current={active === id ? 'true' : undefined}
                className={`rounded-full px-4 py-2 font-body-md text-sm transition-colors ${
                  active === id
                    ? 'bg-white/70 text-primary shadow-sm'
                    : 'text-on-surface-variant hover:text-primary'
                }`}
              >
                {label}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-1 sm:gap-2">
          {SOCIALS.map(({ href, label, Icon }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
              className="grid size-10 place-items-center rounded-full text-on-surface-variant transition-colors hover:bg-white/60 hover:text-primary"
            >
              <Icon />
            </a>
          ))}

          {/* El botón de reservar en móvil vive en la barra inferior */}
          <button
            type="button"
            // Ojo: () => openWhatsApp() y NO onClick={openWhatsApp}.
            // Si pasas la función directa, React le manda el evento del click
            // como primer argumento y se usaría como "mensaje personalizado".
            onClick={() => openWhatsApp()}
            className="btn-rose ml-1 hidden rounded-full px-5 py-2.5 font-label-md text-sm font-medium transition-transform hover:-translate-y-0.5 active:scale-95 md:inline-flex"
          >
            Reservar cita
          </button>
        </div>
      </nav>
    </header>
  )
}

export default Navbar
