import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"


export default function Login() {
    // States and Variables
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")

    // Others
    const navigate = useNavigate()
    const { login, token } = useAuth()

    // UseEffects



    // Functions
    async function handleSubmit(e) {
        e.preventDefault()
        setError("")

        // Validation
        if (username.length < 3) {
            setError("Username must be atleast 3 Characters")
            return
        } else if (password.length < 8) {
            setError("Password must be atleast 8 Characters")
            return
        }



        const loggedIn = await login(username, password)

        if (loggedIn) {
            navigate("/chat")
        } else {
            setError("Username or Password is wrong")
        }
    }

    return (
        <div className="formContainer">
            <h3>Login</h3>
            <form onSubmit={handleSubmit} className="loginForm authForm">
                <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
                <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                <span className="authError error">{error}</span>
                <button type="submit">Login</button>
            </form>
        </div>
    )
}