import { API_URL } from "../config"
import { useAuth } from "../context/AuthContext"





export function useApiClient() {

    const { token, logout, refreshAccessToken } = useAuth()

    // API Client to send request and refreshToken if response === 401
    async function apiClient(endpoint, options = {}) {
        const config = {
            ...options,
            headers: {
                ...options.headers || {},
                "Authorization": `Bearer ${token}`
            }
        }


        const response = await fetch(`${API_URL}/${endpoint}`, config)

        if (response.status === 401) {

            const refreshed = await refreshAccessToken()
            if (!refreshed) {
                logout()
                return false
            }

            const retryConfig = {
                ...options,
                headers: {
                    ...options.headers || {},
                    "Authorization": `Bearer ${localStorage.getItem("accessToken")}`
                }
            }

            const response = await fetch(`${API_URL}/${endpoint}`, retryConfig)

            if (response.ok) {
                const data = await response.json()
                return data
            } else {
                logout()
                return false
            }

        }

        const data = await response.json()
        return data
    }

    return apiClient
}