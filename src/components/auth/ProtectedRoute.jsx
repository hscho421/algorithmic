import { Navigate, useLocation } from 'react-router-dom';
import useAuthContext from '../../context/useAuthContext';

export default function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuthContext();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return children;
}
