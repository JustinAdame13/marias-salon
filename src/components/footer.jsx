import { InstagramIcon, FacebookIcon } from './icons'

const SOCIALS = [
  { href: 'https://www.instagram.com/mariassbeautysalon/', label: 'Instagram', Icon: InstagramIcon },
  { href: 'https://www.facebook.com/lupita.Garcia.Renteria.7', label: 'Facebook', Icon: FacebookIcon },
]

const LINKS = [
  { href: '#services', label: 'Servicios' },
  { href: '#about', label: 'Acerca de' },
  { href: '#location', label: 'Ubicación' },
]

const Footer = () => {
  return (
    // pb extra en móvil: deja espacio para la barra inferior fija
    <footer className="px-3 pb-[calc(env(safe-area-inset-bottom)+6.5rem)] pt-6 sm:px-md md:pb-8">
      <div className="glass mx-auto max-w-container-max rounded-[2rem] px-6 py-10 sm:px-10">
        <div className="flex flex-col gap-10 md:flex-row md:justify-between">

          {/* Identidad */}
          <div className="max-w-[22rem]">
            <img src="/logo-marias.png" alt="Maria's Beauty Salon" width="640" height="206" className="h-14 w-auto" loading="lazy" />
            <p className="mt-4 font-body-md text-sm leading-relaxed text-secondary">
              Redefiniendo la belleza a través del equilibrio y la atención personalizada en Torreón.
            </p>
            <div className="mt-5 flex gap-2">
              {SOCIALS.map(({ href, label, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-white/50 px-4 py-2 font-label-md text-sm text-primary transition-colors hover:bg-primary hover:text-on-primary"
                >
                  <Icon size={16} />
                  {label}
                </a>
              ))}
            </div>
          </div>

          {/* Navegación + contacto */}
          <div className="grid grid-cols-2 gap-8 sm:gap-16">
            <nav aria-label="Pie de página" className="flex flex-col gap-3">
              <span className="font-label-md text-xs uppercase tracking-[0.25em] text-gold-ink">Explora</span>
              {LINKS.map((l) => (
                <a key={l.href} href={l.href} className="font-body-md text-sm text-secondary transition-colors hover:text-primary">
                  {l.label}
                </a>
              ))}
            </nav>
            <div className="flex flex-col gap-3">
              <span className="font-label-md text-xs uppercase tracking-[0.25em] text-gold-ink">Contacto</span>
              <p className="font-body-md text-sm text-secondary">Torreón, Coahuila</p>
              <p className="font-body-md text-sm text-secondary">Lun a Sáb · 9:00 a 20:00</p>
              <p className="font-body-md text-xs leading-snug text-on-surface-variant">
                Citas fuera de horario con costo extra
              </p>
            </div>
          </div>
        </div>

        <div className="mt-10 gold-rule opacity-60" />
        <p className="mt-5 text-center font-body-md text-xs text-on-surface-variant md:text-left">
          © {new Date().getFullYear()} Maria's Beauty Salon · Torreón, Coahuila
        </p>
      </div>
    </footer>
  )
}

export default Footer
