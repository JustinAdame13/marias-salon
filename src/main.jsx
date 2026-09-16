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
import { AgendaAuthProvider } from './context/AgendaAuthContext.jsx'
import ProtectedRoute from './components/agenda/ProtectedRoute.jsx'
import AgendaLayout from './components/agenda/AgendaLayout.jsx'
import AgendaLogin from './pages/agenda/Login.jsx'
import AgendaDashboard from './pages/agenda/Dashboard.jsx'
import Clientas from './pages/agenda/Clientas.jsx'
import Servicios from './pages/agenda/Servicios.jsx'
import Plantillas from './pages/agenda/Plantillas.jsx'
import Empleadas from './pages/agenda/Empleadas.jsx'
import Citas from './pages/agenda/Citas.jsx'
import Mensajes from './pages/agenda/Mensajes.jsx'
import Usuarios from './pages/agenda/Usuarios.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AgendaAuthProvider>
        <WhatsAppProvider>
          <Routes>
            <Route path="/" element={<App />} />
            <Route path="/confirmar" element={<ConfirmarCita />} />
            <Route path="/retoque" element={<Retoque />} />
            <Route path="/cumpleanos" element={<Cumpleanos />} />
            <Route path="/agenda/login" element={<AgendaLogin />} />
            <Route
              path="/agenda"
              element={
                <ProtectedRoute>
                  <AgendaLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<AgendaDashboard />} />
              <Route path="citas" element={<Citas />} />
              <Route path="clientas" element={<Clientas />} />
              <Route path="servicios" element={<Servicios />} />
              <Route path="plantillas" element={<Plantillas />} />
              <Route path="empleadas" element={<Empleadas />} />
              <Route path="mensajes" element={<Mensajes />} />
              <Route path="usuarios" element={<Usuarios />} />
            </Route>
          </Routes>
          <WhatsAppModal />
        </WhatsAppProvider>
      </AgendaAuthProvider>
    </BrowserRouter>
  </StrictMode>,
)