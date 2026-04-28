import { useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

export default function ChatItem({ chat }) {


    // Hooks
    const { user } = useAuth()
    const navigate = useNavigate()

    // Variables
    const chatName = chat.conversation_type === "direct" ? chat.participants.find((p) => p.user !== user.id)?.username : chat.name
    const pfp = chatName[0].toUpperCase()

    let formattedDate = ""
    if (chat.last_message) {

        const updatedAt = new Date(chat.last_message?.created_at)
        const today = new Date().toLocaleDateString()
        formattedDate = updatedAt.toLocaleDateString() === today ? updatedAt.toLocaleTimeString([], {
            hour: "numeric",
            minute: "2-digit",
        }) : updatedAt.toLocaleDateString()
    }

    return (
        <div className="chatItem" onClick={() => { navigate(`/chat/${chat.id}`) }}>
            <div className="pfp">
                {pfp}
            </div>
            <div className="nameAndLastMsg">
                <span className="chatName">{chatName}</span>
                <span className="lastMsg">{chat.last_message?.content || ""}</span>
            </div>
            <div className="dateAndCount">
                <span className="lastUpdated">{formattedDate || "New"}</span>
                {chat.unread_count > 0 && <span className="unReadCount">{chat.unread_count}</span>}
            </div>
        </div>
    )
}