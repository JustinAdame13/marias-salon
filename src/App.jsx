import Navbar from './components/Navbar'
import Hero from './components/Hero'
import About from './components/About'
import Services from './components/Services'
import Location from './components/Location'
import Footer from './components/footer'
import WhatsAppButton from './components/WhatsAppButton'
import { WhatsAppProvider } from './context/WhatsAppContext'

function App() {
  return (
    <WhatsAppProvider>
      <Navbar />
      <main>
        <Hero />
        <About />
        <Services />
        <Location />
      </main>
      <Footer />
      <WhatsAppButton />
    </WhatsAppProvider>
  )
}

export default App