import { useAuthStore } from "../store/authStore";
import { Navigate } from "react-router";
import { useEffect } from "react";
import * as styles from "../styles/common";

function ProtectedRoute({ children, allowedRoles }) {
  const loading = useAuthStore((state) => state.loading);
  const currentUser = useAuthStore((state) => state.currentUser);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const token = useAuthStore((state) => state.token);
  const checkAuth = useAuthStore((state) => state.checkAuth);

  // On page refresh: token exists but currentUser is null — restore session
  useEffect(() => {
    if (token && !currentUser && !loading) {
      checkAuth();
    }
  }, [token, currentUser, loading]);

  // While restoring session, show nothing (or a spinner)
  if (loading || (token && !currentUser)) {
    return <p className={styles.loadingClass + " mt-8"}>Loading...</p>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(currentUser?.role)) {
    return (
      <Navigate
        to="/unauthorized"
        replace
        state={{ redirectTo: "/" }}
      />
    );
  }

  return children;
}

export default ProtectedRoute;
