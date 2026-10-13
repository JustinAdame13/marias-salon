import { MotionConfig } from 'framer-motion'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import About from './components/About'
import Services from './components/Services'
import Location from './components/Location'
import Footer from './components/footer'
import WhatsAppButton from './components/WhatsAppButton'
import MobileTabBar from './components/MobileTabBar'

function App() {
  return (
    // reducedMotion="user": si la persona activó "reducir movimiento"
    // en su teléfono, framer-motion desactiva las animaciones de desplazamiento.
    <MotionConfig reducedMotion="user">
      {/* .landing aplica la paleta rosa/dorado SOLO aquí (no toca la agenda) */}
      <div className="landing min-h-screen">
        <div aria-hidden className="landing-ambient" />
        <Navbar />
        <main>
          <Hero />
          <Services />
          <About />
          <Location />
        </main>
        <Footer />
        <WhatsAppButton />
        <MobileTabBar />
      </div>
    </MotionConfig>
  )
}

export default App
