import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useAuthStore } from "../store/authStore"
import * as styles from "../styles/common"

function Home() {

  const navigate = useNavigate()

  const { isAuthenticated, currentUser } = useAuthStore()

  useEffect(() => {

    if (isAuthenticated && currentUser) {

      const role = currentUser.role?.toUpperCase()

      if (role === "USER") {
        navigate("/user-profile")
      }

      else if (role === "AUTHOR") {
        navigate("/author-profile")
      }
    }

  }, [isAuthenticated, currentUser, navigate])

  return (
    <div className="text-center max-w-2xl mx-auto py-20">

      <h1 className="text-amber-100 text-6xl font-bold">
        Write less.
      </h1>

      <h1 className={styles.pageTitleClass + " text-[#0066cc] mb-8"}>
        Say more.
      </h1>

      <p className={styles.bodyText + " text-xl mb-12"}>
        A minimalist platform for thinkers, writers, and readers who value clarity and elegance.
      </p>

      <div className="flex gap-4 justify-center">

        <button
          onClick={() => navigate("/register")}
          className={styles.primaryBtn + " scale-110 !px-8 !py-3"}
        >
          Get Started
        </button>

        <button
          onClick={() => navigate("/login")}
          className={styles.secondaryBtn + " scale-110 !px-8 !py-3"}
        >
          Sign In
        </button>

      </div>

    </div>
  )
}

export default Home;