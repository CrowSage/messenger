import { useState } from "react"
import { useNavigate } from "react-router-dom"

export default function Login() {
    // States and Variables
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")

    // Others
    const navigate = useNavigate()
    const { login, token } = useAuth()



    if (token) {
        navigate("/chat/")
    }



    // UseEffects



    // Functions
    function handleSubmit(e) {
        e.preventDefault()




    }

    return (
        <div className="formContainer">
            <h3>Login</h3>

            <form onSubmit={handleSubmit} className="loginForm authForm">
                <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
                <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                <button type="submit">Login</button>
            </form>
        </div>
    )
}