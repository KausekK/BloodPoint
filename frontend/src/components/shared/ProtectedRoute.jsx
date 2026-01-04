import { Navigate, useLocation } from "react-router-dom";
import authService from "../../services/AuthenticationService";

export default function ProtectedRoute({ allowedRoles = [], children }) {
  const location = useLocation();
  const isAuth = authService.isAuthenticated();

  if (!isAuth) {
    return <Navigate to="/login" replace />;
  }

  if (
    authService.mustChangePassword() &&
    location.pathname !== "/change-password"
  ) {
    return <Navigate to="/change-password" replace />;
  }

  if (!allowedRoles.length) {
    return children;
  }

  const roles = authService.getUser()?.roles || [];
  const ok = allowedRoles.some((r) => roles.includes(r));

  if (!ok) {
    return <Navigate to="/" replace />;
  }

  return children;
}