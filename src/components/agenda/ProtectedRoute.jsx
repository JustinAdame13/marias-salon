import { Navigate } from 'react-router-dom'
import { useAgendaAuth } from '../../context/AgendaAuthContext'

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAgendaAuth()

  if (loading) return <div className="p-8 text-center">Cargando...</div>
  if (!user) return <Navigate to="/agenda/login" replace />

  return children
}

export default ProtectedRoute