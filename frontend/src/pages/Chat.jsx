import { useParams } from "react-router-dom"
import Sidebar from "../components/Sidebar"
import ChatWindow from "../components/ChatWindow"
import { useState, useEffect } from "react"
import { useApiClient } from "../hooks/useApiClient"

export default function Chat() {


    // States and Variables
    const [allChats, setAllChats] = useState([])

    // Others
    const { chatId } = useParams()
    const apiClient = useApiClient()
    const activeChat = allChats.find(chat => chat.id === parseInt(chatId))

    // UseEffects
    useEffect(() => {

        async function fetchChats() {
            const data = await apiClient("api/chat/", { method: "GET" })
            setAllChats(data.chats)
        }

        fetchChats()

    }, [])


    // Functions

    // Returning
    return (
        <div className="mainChat">
            <Sidebar chats={allChats} />
            {chatId && <ChatWindow chatId={chatId} activeChat={activeChat} />}
        </div>
    )
}