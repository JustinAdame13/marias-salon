import { useEffect, useRef } from 'react'
import { useAnimation, useInView } from 'framer-motion'

const useScrollReveal = (threshold = 0.15) => {
  const ref = useRef(null)
  const controls = useAnimation()

  const isInView = useInView(ref, { 
    once: false,      // ← cambio clave: ahora detecta cada vez
    amount: threshold 
  })

  useEffect(() => {
    if (isInView) {
      controls.start('visible')
    } else {
      controls.start('hidden')  // ← resetea cuando sale del viewport
    }
  }, [isInView, controls])

  return { ref, controls }
}

export default useScrollReveal