import { StrictMode, lazy, Suspense } from 'react'
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
import RoleRoute from './components/agenda/RoleRoute.jsx'
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

// lazy(): Estadísticas (y Recharts, que pesa bastante) se descargan
// solo cuando alguien entra a esa página, no al abrir la landing.
// eslint-disable-next-line react-refresh/only-export-components -- main.jsx es el punto de entrada, no se recarga con Fast Refresh
const Estadisticas = lazy(() => import('./pages/agenda/Estadisticas.jsx'))

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
              <Route
                path="estadisticas"
                element={
                  <RoleRoute allowedRoles={['ADMIN', 'JEFA']}>
                    <Suspense fallback={<p className="py-10 text-center text-secondary">Cargando...</p>}>
                      <Estadisticas />
                    </Suspense>
                  </RoleRoute>
                }
              />
              <Route
                path="plantillas"
                element={<RoleRoute allowedRoles={['ADMIN']}><Plantillas /></RoleRoute>}
              />
              <Route
                path="empleadas"
                element={<RoleRoute allowedRoles={['ADMIN']}><Empleadas /></RoleRoute>}
              />
              <Route
                path="mensajes"
                element={<RoleRoute allowedRoles={['ADMIN']}><Mensajes /></RoleRoute>}
              />
              <Route
                path="usuarios"
                element={<RoleRoute allowedRoles={['ADMIN']}><Usuarios /></RoleRoute>}
              />
            </Route>
          </Routes>
          <WhatsAppModal />
        </WhatsAppProvider>
      </AgendaAuthProvider>
    </BrowserRouter>
  </StrictMode>,
)