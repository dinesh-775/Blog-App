import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router";
import * as styles from "../styles/common";

const Unauthorized = ({ delay = 5000 }) => {
  console.log("unauthorized");
  const navigate = useNavigate();
  const location = useLocation();

  // Get redirectTo from state
  const redirectTo = location.state?.redirectTo || "/login";
  console.log("redirect",redirectTo)

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate(redirectTo, { replace: true });
    }, delay);

    return () => clearTimeout(timer);
  }, [navigate, redirectTo, delay]);

  return (
    <div className={styles.pageBackground + " min-h-screen flex flex-col justify-center items-center"}>
      <h1 className={styles.pageTitleClass + " text-red-600 mb-4"}>403 - Unauthorized</h1>
      <p className={styles.bodyText + " text-lg mb-2"}>You don’t have permission to access this page.</p>
      <p className={styles.mutedText}>Redirecting...</p>
    </div>
  );
};

export default Unauthorized;