import React from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import * as styles from "../styles/common"
import { useAuthStore } from "../store/authStore"

function Header() {
  const navigate = useNavigate()
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  const logout = useAuthStore((state) => state.logout)

  const handleLogout = async () => {
    await logout()
    navigate("/login")
  }

  return (
    <header className={styles.navbarClass}>
      <div className={styles.navContainerClass}>

        <p className={styles.navBrandClass}>LOGO</p>

        <nav>
          <ul className={styles.navLinksClass}>

            <li>
              <NavLink to="/" className={({ isActive }) =>
                isActive ? styles.navLinkActiveClass : styles.navLinkClass
              }>
                Home
              </NavLink>
            </li>

            {!isAuthenticated && (
              <>
                <li>
                  <NavLink to="/register" className={({ isActive }) =>
                    isActive ? styles.navLinkActiveClass : styles.navLinkClass
                  }>
                    Register
                  </NavLink>
                </li>

                <li>
                  <NavLink to="/login" className={({ isActive }) =>
                    isActive ? styles.navLinkActiveClass : styles.navLinkClass
                  }>
                    Login
                  </NavLink>
                </li>
              </>
            )}

            {isAuthenticated && (
              <li>
                <button onClick={handleLogout} className={styles.primaryBtn}>
                  Logout
                </button>
              </li>
            )}

          </ul>
        </nav>

      </div>
    </header>
  )
}

export default Header