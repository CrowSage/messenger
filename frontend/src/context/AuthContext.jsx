// Imports
import { createContext, useContext, useEffect, useState } from "react"
import { API_URL } from "../config"

// Context Box
export const AuthContext = createContext()


// Creating things to put in the box
export function AuthProvider({ children }) {

    const [token, setToken] = useState(localStorage.getItem("accessToken") || null)
    const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")) || null)

    // UseEffects
    useEffect(() => {

        async function init() {
            const token = localStorage.getItem("accessToken") || null
            if (token) {
                const response = await fetch(`${API_URL}/api/users/me/`, {
                    method: "GET",
                    headers: { "Authorization": `Bearer ${token}` }
                })

                if (response.ok) {
                    const data = await response.json()
                    setUser(data)
                    localStorage.setItem("user", JSON.stringify(data))
                    return
                }

                const refreshed = await refreshAccessToken()

                if (refreshed) {
                    const token = localStorage.getItem("accessToken") || null

                    const response = await fetch(`${API_URL}/api/users/me/`, {
                        method: "GET",
                        headers: { "Authorization": `Bearer ${token}` }
                    })

                    if (response.ok) {
                        const data = await response.json()
                        setUser(data)
                        localStorage.setItem("user", JSON.stringify(data))
                        return
                    }

                    logout()

                }


                logout()

            }
        }

        init()
    }, [])

    // Functions
    async function login(username, password) {

        if (username.length < 3 || password.length < 8) {
            return
        }


        const response = await fetch(`${API_URL}/api/token/`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password })
        })


        if (response.ok) {
            const data = await response.json()
            setToken(data.access)
            localStorage.setItem("accessToken", data.access)
            localStorage.setItem("refreshToken", data.refresh)


            // Getting User Object
            getUser(data.access)

            return true
        }

        return false
    }

    function logout() {
        localStorage.removeItem("accessToken")
        localStorage.removeItem("refreshToken")
        localStorage.removeItem("user")

        setUser(null)
        setToken(null)
    }

    async function refreshAccessToken() {
        const refreshToken = localStorage.getItem("refreshToken") || null

        if (!refreshToken) {
            return
        }


        const response = await fetch(`${API_URL}/api/token/refresh/`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ "refresh": refreshToken })
        })

        if (response.ok) {
            const data = await response.json()

            localStorage.setItem("accessToken", data.access)
            setToken(data.access)

            return true
        }
        return false
    }


    async function getUser(token) {

        const response = await fetch(`${API_URL}/api/users/me/`, {
            method: "GET",
            headers: { "Authorization": `Bearer ${token}` }
        })


        const data = await response.json()


        setUser(data)
        localStorage.setItem("user", JSON.stringify(data))
    }
    // Putting things in the box and returning
    return (
        <AuthContext.Provider value={{ login, logout, user, token, refreshAccessToken }} >
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {

    return useContext(AuthContext)
}