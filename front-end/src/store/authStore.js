import { create } from "zustand";
import axios from "axios";

// Backend URL from .env (VITE_API_URL)
const BASE_URL = import.meta.env.VITE_API_URL;

console.log("Using API BASE_URL:", BASE_URL);

// Axios instance (cleaner & reusable)
const api = axios.create({
    baseURL: BASE_URL,
    withCredentials: true,
});

export const useAuthStore = create((set, get) => ({
    currentUser: null,
    token: localStorage.getItem("token") || null,
    error: null,
    loading: false,
    isAuthenticated: !!localStorage.getItem("token"),

    // 🔐 LOGIN
    login: async (userCredObj) => {
        try {
            set({ loading: true, error: null });

            const res = await api.post("/common-api/login", userCredObj);

            const token = res.data?.token;
            const user = res.data?.payload;

            if (token && user) {
                localStorage.setItem("token", token);

                set({
                    token,
                    currentUser: user,
                    isAuthenticated: true,
                    loading: false,
                    error: null,
                });
            } else {
                set({
                    loading: false,
                    isAuthenticated: false,
                    currentUser: null,
                    error: "Login failed: invalid server response",
                });
            }
        } catch (err) {
            set({
                loading: false,
                isAuthenticated: false,
                currentUser: null,
                error:
                    err.response?.data?.error ||
                    err.response?.data?.message ||
                    "Login failed",
            });
        }
    },

    // 🚪 LOGOUT
    logout: async () => {
        try {
            set({ loading: true, error: null });

            await api.get("/common-api/logout");
        } catch (err) {
            console.log("Logout API failed (ignored):", err.message);
        } finally {
            localStorage.removeItem("token");

            set({
                loading: false,
                isAuthenticated: false,
                currentUser: null,
                token: null,
                error: null,
            });
        }
    },

    // 🔁 CHECK AUTH (restore session)
    checkAuth: async () => {
        const token = localStorage.getItem("token");

        if (!token) {
            set({
                loading: false,
                isAuthenticated: false,
                currentUser: null,
            });
            return;
        }

        try {
            set({ loading: true });

            const res = await api.get("/common-api/check-auth", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            set({
                currentUser: res.data?.payload,
                token,
                isAuthenticated: true,
                loading: false,
            });
        } catch (err) {
            console.log("Auth check failed:", err.message);

            localStorage.removeItem("token");

            set({
                currentUser: null,
                isAuthenticated: false,
                token: null,
                loading: false,
            });
        }
    },
}));

export default useAuthStore;