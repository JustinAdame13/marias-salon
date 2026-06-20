import { useEffect } from 'react'
import { useAnimation } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'

// Hook reutilizable — cualquier componente que quiera animación
// al hacer scroll solo necesita llamar a useScrollReveal()
const useScrollReveal = (threshold = 0.15) => {
  const ref = useRef(null)
  const controls = useAnimation()

  // useInView detecta si el elemento está visible en pantalla
  // threshold: qué porcentaje del elemento debe ser visible (0.15 = 15%)
  const isInView = useInView(ref, { 
    once: true,        // solo anima una vez, no cada vez que aparece
    threshold 
  })

  useEffect(() => {
    if (isInView) {
      controls.start('visible')
    }
  }, [isInView, controls])

  return { ref, controls }
}

export default useScrollReveal