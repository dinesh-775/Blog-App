import { useRouteError } from "react-router";
import * as styles from "../styles/common";

function ErrorBoundary() {
  const errorObj = useRouteError();
  const data = errorObj?.data || "An unexpected error occurred.";
  const status = errorObj?.status || 500;
  const statusText = errorObj?.statusText || "Internal Server Error";

  return (
    <div className={styles.pageBackground + " text-center p-20 min-h-screen"}>
      <img className="block mx-auto rounded-2xl w-96 mb-7" src="https://media.tenor.com/WqGTNFmFqjkAAAAM/saquontroll-saquonjudge26.gif" alt="Error" />
      <p className={styles.headingClass}>{data}</p>
      <p className="text-2xl text-[#ff3b30] mt-4 font-bold tracking-tight">
        {status} - {statusText}
      </p>
    </div>
  );
}

export default ErrorBoundary;