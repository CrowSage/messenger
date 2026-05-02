import { useParams } from "react-router-dom"
import Sidebar from "../components/Sidebar"
import ChatWindow from "../components/ChatWindow"
import { useState, useEffect } from "react"
import { useApiClient } from "../hooks/useApiClient"
import NewGroupModal from "../components/NewGroupModal"

export default function Chat() {


    // States and Variables
    const [allChats, setAllChats] = useState([])
    const [showNewGroupModal, setShowNewGroupModal] = useState(true)

    // Others
    const { chatId } = useParams()
    const apiClient = useApiClient()
    const activeChat = allChats.find(chat => chat.id === parseInt(chatId))

    // UseEffects
    useEffect(() => {


        fetchChats()

    }, [])


    // Functions
    async function fetchChats() {
        const data = await apiClient("api/chat/", { method: "GET" })
        setAllChats(data.chats)
    }

    // Returning
    return (
        <div className="mainChat">
            <Sidebar chats={allChats} fetchChats={fetchChats} setShowNewGroupModal={setShowNewGroupModal} />
            {chatId && <ChatWindow chatId={chatId} activeChat={activeChat} fetchChats={fetchChats} />}
            {showNewGroupModal && <NewGroupModal setShowNewGroupModal={setShowNewGroupModal} />}
        </div>
    )
}