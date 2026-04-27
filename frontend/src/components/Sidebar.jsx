import { useEffect, useState } from "react"
import { useAuth } from "../context/AuthContext"
import { useApiClient } from "../hooks/useApiClient"
import { useNavigate } from "react-router-dom"
import { BiSearch } from "react-icons/bi"
import ChatItem from "./ChatItem"
import UserItem from "./UserItem"


export default function Sidebar({ chats, fetchChats }) {
    // States and Variables
    const [searchInput, setSearchInput] = useState("")
    const [searchResult, setSearchResult] = useState([])

    // Others
    const { user } = useAuth()
    const apiClient = useApiClient()
    const navigate = useNavigate()

    // UseEffects

    // - Login Checker
    useEffect(() => {
        if (!user) {
            navigate("/login")
        }
    }, [user])

    // - Searching
    useEffect(() => {
        async function searchUsers(query) {

            const data = await apiClient(`api/users/search/?q=${query}`, { method: "GET" })
            console.log(data)
            setSearchResult(data)
        }
        const myTimeout = setTimeout(() => {
            searchUsers(searchInput)
        }, 300)
        return () => clearTimeout(myTimeout)

    }, [searchInput])


    // Functions




    return (
        <div className="mainSidebar">
            <h1 className="logo">Messenger</h1>
            <div className="searchBox">
                <BiSearch size={20} />
                <input type="text" value={searchInput} onChange={(e) => setSearchInput(e.target.value)} className="searchInput" placeholder="Search or start a new chat" />
            </div>

            <div className="chatListContainer">
                {chats && chats.map((chat) => (
                    <ChatItem key={chat.id} chat={chat} />
                ))}

                <div className="searchResultContainer">
                    {searchResult.length > 0 && <hr className="resultDivider" />}
                    {searchResult.length > 0 && searchResult.map((result) => (
                        <UserItem key={result.id} result={result} />
                    ))}
                </div>
            </div>



        </div>
    )
}