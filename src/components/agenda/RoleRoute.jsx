import { Navigate } from 'react-router-dom'
import { useAgendaAuth } from '../../context/AgendaAuthContext'

const RoleRoute = ({ allowedRoles, children }) => {
  const { user } = useAgendaAuth()

  if (!allowedRoles.includes(user?.rol)) {
    return <Navigate to="/agenda" replace />
  }

  return children
}

export default RoleRoute