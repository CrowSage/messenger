import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { HiSquare2Stack } from "react-icons/hi2"


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
            <h1>Login</h1>
            <span className="authError error">{error}</span>
            <form onSubmit={handleSubmit} className="loginForm authForm">
                <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
                <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                <button type="submit" className="authBtn">Login</button>
                <span className="authLink">Don't have an account? <Link className="links" to={"/register"}>Register</Link></span>
            </form>
        </div>
    )
}