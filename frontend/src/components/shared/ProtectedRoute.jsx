import { Navigate } from "react-router-dom";
import authService from "../../services/AuthenticationService";

export default function ProtectedRoute({ allowedRoles = [], children }) {
  const isAuth = authService.isAuthenticated();

  if (!isAuth) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles || allowedRoles.length === 0) {
    return children;
  }

  const user = authService.getUser();
  const userRoles = (user?.roles) || [];

  const ok = allowedRoles.some((r) => userRoles.includes(r));
  if (!ok) {
    return <Navigate to="/" replace />;
  }

  return children;
}
