import { useEffect, useState, useRef } from "react"
import { useApiClient } from "../hooks/useApiClient"
import Message from "../components/Message"
import { useAuth } from "../context/AuthContext"
import { FaArrowUp } from "react-icons/fa6";
import { WEBSOCKET_API_URL } from "../config";
import { LuPaperclip } from "react-icons/lu";


export default function ChatWindow({ chatId, activeChat, fetchChats }) {

    // States and Variables
    const [messages, setMessages] = useState([])
    const [messageInput, setMessageInput] = useState("")
    const socketRef = useRef(null)
    const textAreaRef = useRef(null)
    const thisRef = useRef(null)


    // Others
    const apiClient = useApiClient()
    const { user, token, refreshAccessToken } = useAuth()
    console.log(activeChat)


    const chatName =
        activeChat?.conversation_type === "direct"
            ? activeChat.participants.find((p) => p.user !== user.id)?.username
            : activeChat?.name;

    const pfp = chatName ? chatName[0].toUpperCase() : "?";

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
                fetchChats()
            }

            socket.onclose = () => {

            }

        }
        initSocket();
        return () => {
            socketRef.current?.close();
        };
    }, [chatId])

    useEffect(() => {
        thisRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    // Functions

    function sendMessage() {
        if (socketRef.current && messageInput.trim()) {
            socketRef.current.send(JSON.stringify({ content: messageInput }))
            setMessageInput("")
            textAreaRef.current.style.height = "auto"
        }
    }



    if (!activeChat) return <p>Loading...</p>
    return (
        <div className="mainChatWindow">
            <h4 className="chatHeader">
                <span className="pfp">{pfp}</span>
                {chatName}
            </h4>

            <div className="messageContainer">

                {messages.map((message, index) => (
                    <Message content={message.content} created_at={message.created_at} sender={message.sender} key={message.id || index} />
                ))}

                <div ref={thisRef}></div>
            </div>
            <div className="messageFormContainer">

                <form onSubmit={(e) => { e.preventDefault(); sendMessage() }} className="messageForm">
                    <textarea type="text" value={messageInput} onChange={(e) => setMessageInput(e.target.value)} className="messageInput" placeholder="Message" rows={1} onInput={(e) => {
                        e.target.style.height = "auto"
                        e.target.style.height = e.target.scrollHeight + "px"
                    }}
                        onKeyDown={(e) => {
                            if (e.key === "Enter" && !e.shiftKey) {
                                e.preventDefault()
                                sendMessage()
                            }

                        }}


                        ref={textAreaRef}
                    />
                    <div className="messageActions">
                        <button type="submit" className="messageSendBtn"><FaArrowUp size={16} /></button>
                    </div>
                </form>
            </div>
        </div>
    )
}