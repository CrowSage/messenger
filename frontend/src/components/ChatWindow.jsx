import { useEffect, useState, useRef } from "react"
import { useApiClient } from "../hooks/useApiClient"
import Message from "../components/Message"
import { useAuth } from "../context/AuthContext"
import { FaArrowUp } from "react-icons/fa6";
import { WEBSOCKET_API_URL } from "../config";
import { LuPaperclip } from "react-icons/lu";
import { IoMdClose } from "react-icons/io";

import { useNavigate } from "react-router-dom";


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
    const navigate = useNavigate()

    const chatName =
        activeChat?.conversation_type === "direct"
            ? activeChat.participants.find((p) => p.user !== user.id)?.username
            : activeChat?.name;

    const pfp = chatName ? chatName[0].toUpperCase() : "?";
    const is_online = activeChat?.conversation_type === "direct" ? activeChat.participants.find((p) => p.user !== user.id)?.is_online : false


    // UseEffects
    useEffect(() => {

        async function fetchChat(id) {
            const data = await apiClient(`api/chat/${id}/`, { "method": "GET" })
            if (data) {
                setMessages(data)
                console.log(data)
                await markAllAsRead(chatId)
                fetchChats()
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

            socket.onopen = () => {
                fetchChats()
            }
            socket.onmessage = (event) => {
                const data = JSON.parse(event.data)
                if (data.type === "read_receipt") {
                    setMessages(prev => prev.map(msg => msg.sender === user.id ? { ...msg, read_by: [...(msg.read_by || []), data.user_id] }
                        : msg
                    ))
                } else if (data.type === "user_status") {
                    fetchChats()
                } else {

                    setMessages(prev => [...prev, data || []])
                    markAllAsRead(chatId)
                    fetchChats()
                }
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

    async function markAllAsRead(id) {
        const data = await apiClient(`api/chat/${id}/read/`, { method: "POST" })
    }


    if (!activeChat) return <div class="loadingtext">
        <p>Loading</p>
    </div>

    return (
        <div className="mainChatWindow">
            <h4 className="chatHeader">
                <span className="pfp">{pfp}</span>
                <span className="nameAndStatus">
                    <span>{chatName}</span>

                    {activeChat.conversation_type === "direct" ?

                        <span className={`userStatus ${is_online && "userOnline"}`}>{is_online ? "Online" : "Offline"}</span>
                        : <span className="participantList">
                            {activeChat.participants.map((p, i) => (
                                <span className="participant" key={i}>
                                    {p.username}
                                    {i < activeChat.participants.length - 1 && ", "}
                                </span>
                            ))}
                        </span>
                    }

                </span>
                <span className="chatCloseBtn" onClick={() => { navigate(-1) }}>
                    <IoMdClose />
                </span>
            </h4>

            <div className="messageContainer">

                {messages.map((message, index) => (
                    <Message content={message.content} created_at={message.created_at} sender={message.sender} read_by={message.read_by} key={message.id || index} />
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