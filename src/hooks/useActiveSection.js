import { useEffect, useState } from 'react'

// Devuelve el id de la sección que está actualmente en pantalla.
// Usa IntersectionObserver: el navegador nos avisa cuando un elemento
// entra o sale del viewport, sin tener que escuchar cada evento de scroll
// (es mucho más eficiente, sobre todo en celulares).
//
// rootMargin '-45% 0px -50% 0px' = solo cuenta como "activa" la sección
// que cruza una franja delgada a la mitad de la pantalla.
const useActiveSection = (ids) => {
  const [active, setActive] = useState(null)
  const key = ids.join(',')

  useEffect(() => {
    const elements = key
      .split(',')
      .map((id) => document.getElementById(id))
      .filter(Boolean)

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id)
        })
      },
      { rootMargin: '-45% 0px -50% 0px' }
    )

    elements.forEach((el) => observer.observe(el))
    return () => observer.disconnect() // limpieza al desmontar
  }, [key])

  return active
}

export default useActiveSection
