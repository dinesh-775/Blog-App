import React, { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useForm } from "react-hook-form"
import { useAuthStore } from "../store/authStore"
import * as styles from "../styles/common"

function Login() {
    const navigate = useNavigate()
    const { register, handleSubmit } = useForm()
    const login = useAuthStore((state) => state.login)
    const loading = useAuthStore((state) => state.loading)
    const error = useAuthStore((state) => state.error)
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
    const currentUser = useAuthStore((state) => state.currentUser)

    const onUserLogin = async (userCredObj) => {
        console.log(userCredObj)
        await login(userCredObj)
    }
    useEffect(() => {
        if (isAuthenticated && currentUser) {
            const role = currentUser.role?.toUpperCase()
            if (role === "USER") {
                navigate("/user-profile")
            } else if (role === "AUTHOR") {
                navigate("/author-profile")
            }
        }
    }, [isAuthenticated, currentUser, navigate])
    return (
        <div className={styles.formCard}>
            <h2 className={styles.formTitle}>Login</h2>
            {error && <div className={styles.errorClass + " mb-6"}>{error}</div>}
            <form onSubmit={handleSubmit(onUserLogin)} className={styles.formGroup}>
                <div className="mb-4">
                    <label className={styles.labelClass}>Email Address</label>
                    <input
                        type='email'
                        {...register("email")}
                        placeholder='name@example.com'
                        className={styles.inputClass}
                    />
                </div>
                <div className="mb-6">
                    <label className={styles.labelClass}>Password</label>
                    <input
                        type='password'
                        {...register("password")}
                        placeholder='••••••••'
                        className={styles.inputClass}
                    />
                </div>
                <button type='submit' className={styles.submitBtn}>
                    {loading ? 'Logging in...' : 'Sign In'}
                </button>
            </form>
            <p className={styles.mutedText + " text-center mt-6"}>
                Don't have an account? <span className={styles.linkClass + " cursor-pointer"} onClick={() => navigate('/register')}>Create one</span>
            </p>
        </div>
    )
}

export default Login