import { useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { useApiClient } from "../hooks/useApiClient"

export default function UserItem({ result, resultClickHandler }) {

    const pfp = result.username[0].toUpperCase()



    // Functions


    return (
        <div className="userItem" onClick={() => { resultClickHandler(result.id) }}>
            <div className="pfp">
                {pfp}
            </div>
            <span className="userName">{result.username}</span>
        </div>
    )
}