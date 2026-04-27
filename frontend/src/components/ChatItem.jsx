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
            <span>{chatName}</span>
        </div>
    )
}