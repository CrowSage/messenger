import { useAuth } from "../context/AuthContext"
import { IoCheckmarkDone } from "react-icons/io5";

export default function Message({ content, created_at, sender, read_by }) {

    // Hooks

    // Context
    const { user } = useAuth()

    // Variables
    const formattedDate = new Date(created_at).toLocaleTimeString([], {
        hour: "numeric",
        minute: "2-digit",
    })

    const isOwn = sender === user.id
    const isRead = read_by?.some(id => id !== sender) ?? false
    return (
        <span className={`messageBubble ${isOwn ? "sended" : "received"}`}>
            <span className="messageContent">{content}</span>
            <span className="messageData">
                <span>{formattedDate}</span>
                {isOwn && <IoCheckmarkDone className={`icon ${isRead ? "readed" : ""}`} size={18} />}
            </span>
        </span>
    )
}