import { useNavigate } from "react-router-dom"

export default function Home() {

    const navigate = useNavigate()

    return (
        <div className="mainHome">
            <div className="navbar">
                <span className="logo">Messenger</span>
                <span className="action">
                    <button onClick={() => { navigate("/register") }}>
                        Get Started
                    </button>
                </span>
            </div>
            <div className="hero">

                <h1>Simple. Easy. Fast.</h1>
                <span>A chat app built by concept</span>
            </div>
            <div className="about">

                <div className="featureContainer">
                    <h3>Features</h3>
                    <span>Real-time messaging</span>
                    <span>Group chats</span>
                    <span> Secure JWT auth</span>
                    <span>User search</span>

                </div>
                <div className="buildWithContainer">
                    <h3>Build With</h3>
                    <span className="buildWith">React</span>
                    <span className="buildWith">Django</span>
                    <span className="buildWith">PostgreSQL</span>
                    <span className="buildWith">Redis</span>
                    <span className="buildWith">WebSockets</span>
                </div>
            </div>



        </div>
    )
}