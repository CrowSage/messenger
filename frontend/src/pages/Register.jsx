import { useState } from "react"
import { API_URL } from "../config.js"
import { useNavigate, Link } from "react-router-dom"


export default function Register() {
    // States and Variables
    const [username, setUsername] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")

    const [error, setError] = useState("")

    // Others
    const navigate = useNavigate()


    // UseEffects


    // Functions
    async function handleSubmit(e) {
        e.preventDefault()
        setError("")

        // Validation
        if (username.length < 3) {
            setError("Username must be atleast 3 Characters.")
            return
        } else if (password.length < 8) {
            setError("Password must be atleast 8 Characters.")
            return
        } else if (password !== confirmPassword) {
            setError("Password and Confirm Password doesn't match.")
            return
        }



        const registered = await registerUser(username, password, email)

        if (registered === true) {
            navigate("/login")
            return
        }

        setError(registered || "Something went wrong")

    }

    async function registerUser(username, password, email) {

        const response = await fetch(`${API_URL}/api/users/register/`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password, email })
        })

        if (response.ok) {
            return true
        } else {

            const data = await response.json()
            const registerError = data.username?.[0] || "Something went wrong"
            return registerError
        }
    }

    return (
        <div className="formContainer">
            <h1>Register</h1>
            <span className="authError error">{error}</span>

            <form onSubmit={handleSubmit} className="registerForm authForm">
                <input type="text" name="username" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
                <input type="email" name="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                <input type="password" name="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                <input type="password" name="confirm-password" placeholder="Confirm Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                <button type="submit" className="authBtn">Register</button>
                <span className="authLink">Already have an account? <Link className="links" to={"/login"}>Login</Link></span>
            </form>
        </div >
    )
}