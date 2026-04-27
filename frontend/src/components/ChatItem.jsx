import { useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

export default function ChatItem({ chat }) {

    const { user } = useAuth()
    const navigate = useNavigate()
    const chatName = chat.conversation_type === "direct" ? chat.participants.find((p) => p.user !== user.id)?.username : chat.name
    const pfp = chatName[0].toUpperCase()

    return (
        <div className="chatItem" onClick={() => { navigate(`/chat/${chat.id}`) }}>
            <div className="pfp">
                {pfp}
            </div>
            <div className="nameAndLastMsg">
                <span className="chatName">{chatName}</span>
                <span className="lastMsg">Congradulation! You are Gay and Les</span>
            </div>
            <div className="dateAndCount">
                <span className="lastUpdated">24/6/2026</span>
                <span className="unReadCount">2</span>
            </div>
        </div>
    )
}