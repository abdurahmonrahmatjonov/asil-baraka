import { Navigate } from "react-router-dom";

interface ProtectedRouteProps {
  isAuthenticated?: boolean;
  userRole?: string;
  allowedRoles?: string[];
  redirectToLogin?: string;
  prevPath?: string;
  children: React.ReactNode;
}

const ProtectedRoute = ({
  isAuthenticated = true,
  userRole,
  allowedRoles,
  redirectToLogin = "/login",
  prevPath = "/not-found",
  children,
}: ProtectedRouteProps) => {
  if (!isAuthenticated) {
    return <Navigate to={redirectToLogin} replace />;
  }

  if (allowedRoles && userRole && !allowedRoles.includes(userRole)) {
    return <Navigate to={prevPath} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
