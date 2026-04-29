import { useAuth } from "../context/AuthContext"
import { IoCheckmarkDone } from "react-icons/io5";

export default function Message({ content, created_at, sender }) {

    // Hooks

    // Context
    const { user } = useAuth()

    // Variables
    const formattedDate = new Date(created_at).toLocaleTimeString([], {
        hour: "numeric",
        minute: "2-digit",
    })

    const isOwn = sender === user.id

    return (
        <span className={`messageBubble ${isOwn ? "sended" : "received"}`}>
            <span className="messageContent">{content}</span>
            <span className="messageData">
                <span>{formattedDate}</span>
                {isOwn && <IoCheckmarkDone className="icon" size={18} />}
            </span>
        </span>
    )
}