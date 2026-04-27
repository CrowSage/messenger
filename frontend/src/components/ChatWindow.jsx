import { useEffect, useState, useRef } from "react"
import { useApiClient } from "../hooks/useApiClient"
import Message from "../components/Message"
import { useAuth } from "../context/AuthContext"
import { IoSend } from "react-icons/io5";
import { WEBSOCKET_API_URL } from "../config";


export default function ChatWindow({ chatId, activeChat }) {

    // States and Variables
    const [messages, setMessages] = useState([])
    const [messageInput, setMessageInput] = useState("")
    const socketRef = useRef(null)

    // Others
    const apiClient = useApiClient()
    const { user, token, refreshAccessToken } = useAuth()
    console.log(activeChat)

    // UseEffects
    useEffect(() => {

        async function fetchChat(id) {
            const data = await apiClient(`api/chat/${id}/`, { "method": "GET" })
            if (data) {
                setMessages(data)
                console.log(data)
            }
        }

        fetchChat(chatId)

    }, [chatId])


    useEffect(() => {

        async function initSocket() {

            await refreshAccessToken()
            const freshToken = localStorage.getItem("accessToken")
            const socket = new WebSocket(`${WEBSOCKET_API_URL}/ws/chat/${chatId}/?token=${freshToken}`)
            socketRef.current = socket

            socket.onmessage = (event) => {
                const data = JSON.parse(event.data)
                setMessages(prev => [...prev, data || []])
            }

            socket.onclose = () => {

            }

        }
        initSocket();
        return () => {
            socket?.close();
        };
    }, [chatId])


    // Functions

    function sendMessage() {
        if (socketRef.current && messageInput.trim()) {
            socketRef.current.send(JSON.stringify({ content: messageInput }))
            setMessageInput("")
        }
    }



    if (!activeChat) return <p>Loading...</p>
    return (
        <div className="mainChatWindow">
            <h4 className="chatHeader">{activeChat.conversation_type === "direct" ? <span>{activeChat.participants.find((p) => p.user !== user.id)?.username}</span> : <span>{activeChat.name}</span>}</h4>

            <div className="messageContainer">

                {messages.map((message, index) => (
                    <Message content={message.content} created_at={message.created_at} sender={message.sender} key={message.id || index} />
                ))}

            </div>
            <form onSubmit={(e) => { e.preventDefault(); sendMessage() }} className="messageForm">
                <input type="text" value={messageInput} onChange={(e) => setMessageInput(e.target.value)} />
                <button type="submit"><IoSend /></button>
            </form>
        </div>
    )
}