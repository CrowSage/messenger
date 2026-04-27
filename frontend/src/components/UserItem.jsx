import { useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

export default function UserItem({ result }) {

    const { user } = useAuth()
    const navigate = useNavigate()
    const pfp = result.username[0].toUpperCase()




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
            await fetchChats()
        }

    }

    return (
        <div className="userItem" onClick={() => { resultClickHandler(result.id) }}>
            <div className="pfp">
                {pfp}
            </div>
            <span className="userName">{result.username}</span>
        </div>
    )
}