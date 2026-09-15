import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import ConfirmarCita from './pages/ConfirmarCita.jsx'
import Retoque from './pages/Retoque.jsx'
import Cumpleanos from './pages/Cumpleanos.jsx'
import { WhatsAppProvider } from './context/WhatsAppContext.jsx'
import WhatsAppModal from './components/WhatsAppModal.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <WhatsAppProvider>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/confirmar" element={<ConfirmarCita />} />
          <Route path="/retoque" element={<Retoque />} />
          <Route path="/cumpleanos" element={<Cumpleanos />} />
        </Routes>
        <WhatsAppModal />
      </WhatsAppProvider>
    </BrowserRouter>
  </StrictMode>,
)