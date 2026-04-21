// Imports
import { createContext } from "react"


// Context Box
export const AuthContext = createContext()



// Things to put in box
export function AuthProvider({ childern }) {

    // Functions
    function login(username, password) {

    }

    function logout() {

    }

    // Returning
    return (
        <AuthContext.Provider value={login, logout}>
            {childern}
        </AuthContext.Provider>
    )
}