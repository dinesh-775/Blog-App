import { create } from "zustand"
import axios from "axios"

const BASE_URL = import.meta.env.VITE_API_URL
console.log("Using API BASE_URL:", BASE_URL);

export const useAuthStore = create(set => ({
    currentUser: null,
    token: localStorage.getItem("token") || null,
    error: null,
    loading: false,
    isAuthenticated: !!localStorage.getItem("token"),

    login: async (userCredObj) => {
        try {
            set({ loading: true, error: null })
            let res = await axios.post(`${BASE_URL}/common-api/login`, userCredObj, { withCredentials: true })

            const token = res.data.token
            const user = res.data.payload

            if (token && user) {
                localStorage.setItem("token", token)
                set({
                    token,
                    loading: false,
                    isAuthenticated: true,
                    currentUser: user,
                    error: null
                })
            } else {
                set({
                    loading: false,
                    isAuthenticated: false,
                    error: "Login failed: unexpected server response",
                    currentUser: null
                })
            }
        } catch (err) {
            set({
                loading: false,
                isAuthenticated: false,
                error: err.response?.data?.error || err.response?.data?.message || "Login failed",
                currentUser: null
            })
        }
    },

    logout: async () => {
        try {
            set({ loading: true, error: null })
            await axios.get(`${BASE_URL}/common-api/logout`, { withCredentials: true })
        } catch (_) {
            // even if the server call fails, clear local state
        } finally {
            localStorage.removeItem("token")
            set({
                loading: false,
                isAuthenticated: false,
                currentUser: null,
                token: null
            })
        }
    },

    // Restore session on page refresh — calls /check-auth with Bearer token
    checkAuth: async () => {
        const token = localStorage.getItem("token")
        if (!token) {
            set({ loading: false, isAuthenticated: false, currentUser: null })
            return
        }
        try {
            set({ loading: true })
            const res = await axios.get(`${BASE_URL}/common-api/check-auth`, {
                headers: { Authorization: `Bearer ${token}` },
                withCredentials: true
            })
            set({
                currentUser: res.data.payload,
                token,
                isAuthenticated: true,
                loading: false,
            })
        } catch (err) {
            // Token expired or invalid — clear everything
            localStorage.removeItem("token")
            set({
                currentUser: null,
                isAuthenticated: false,
                token: null,
                loading: false,
            })
        }
    }
}))

export default useAuthStore
