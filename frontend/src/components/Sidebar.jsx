import { useEffect, useState } from "react"
import { useAuth } from "../context/AuthContext"
import { useApiClient } from "../hooks/useApiClient"
import { useNavigate } from "react-router-dom"

export default function Sidebar() {
    // States and Variables
    const [chats, setChats] = useState([])
    const [searchInput, setSearchInput] = useState("")
    const [searchResult, setSearchResult] = useState([])

    // Others
    const { user } = useAuth()
    const apiClient = useApiClient()
    const navigate = useNavigate()

    // UseEffects


    // - Fetching Chats
    useEffect(() => {

        async function fetchChats() {
            const data = await apiClient("api/chat/", { method: "GET" })
            setChats(data.chats)
        }

        fetchChats()

    }, [])

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

    async function resultClickHandler(otherUserId) {

        const data = await apiClient("api/chat/new/",
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    "type": "direct",
                    "other_user": otherUserId,
                    "name": ""
                })
            })

        if (data.id) {
            navigate(`/chat/${data.id}`)
            setSearchInput("")
            setSearchResult([])
        }

    }



    return (
        <>
            <form className="searchInputContainer">
                <input type="text" value={searchInput} onChange={(e) => setSearchInput(e.target.value)} />
                <button className="submitBtn">submit</button>
            </form>
            {chats && chats.map((chat) => (
                <div key={chat.id} onClick={() => { navigate(`/chat/${chat.id}`) }}>
                    {chat.name}
                </div>
            ))}
            {searchInput && <h1>Search Result</h1>}
            {searchResult && searchResult.map((result) => (
                <span key={result.id} onClick={() => { resultClickHandler(result.id) }}>
                    {result.username}
                </span>

            ))
            }
        </>
    )
}