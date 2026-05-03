import { useState, useEffect } from "react"
import { useApiClient } from "../hooks/useApiClient"
import { BiSearch, BiRename } from "react-icons/bi"
import { RxCross1 } from "react-icons/rx";
import UserItem from "./UserItem"
import { useNavigate } from "react-router-dom";


export default function NewGroupModal({ setShowNewGroupModal }) {
    const [groupName, setGroupName] = useState("")
    const [userSelectSearch, setUserSelectSearch] = useState("")
    const [userSelectSearchResults, setUserSelectSearchResults] = useState([])
    const [users, setUsers] = useState([])
    const [error, setError] = useState("")

    const apiClient = useApiClient()

    const navigate = useNavigate()
    // - Searching
    useEffect(() => {
        async function searchUsers(query) {

            const data = await apiClient(`api/users/search/?q=${query}`, { method: "GET" })
            setUserSelectSearchResults(data)
        }
        const myTimeout = setTimeout(() => {
            searchUsers(userSelectSearch)
        }, 300)
        return () => clearTimeout(myTimeout)

    }, [userSelectSearch])


    function resultClickHandler(clickedUser) {
        setUsers(prev => prev.find(u => u.id === clickedUser.id)
            ? prev.filter(u => u.id !== clickedUser.id)
            : [...prev, clickedUser])
    }


    async function createGroupHandler(name, users) {

        if (!name) {
            setError("Name is required!")
            return
        } else if (users.length < 2) {
            setError("Not Enough Users Selected")
            return
        }

        const data = await apiClient("api/chat/new/", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                "type": "group",
                "users": users.map(u => u.id),
                "name": name
            })

        })

        if (data) {
            navigate(`/chat/${data.id}`)
            setShowNewGroupModal(false)

        }


    }


    return (
        <div className="groupModalMainContainer">
            <div className="groupModalMain">
                <h4>Create New Group</h4>
                <button className="closeModalBtn" onClick={() => { setShowNewGroupModal(false) }}><RxCross1 /></button>


                <div className="groupNameBox">
                    <BiRename size={20} />
                    <input type="text" placeholder="Group Name" value={groupName} onChange={(e) => setGroupName(e.target.value)} className="groupNameInput" />
                </div>
                <div className="userSelector">
                    <div className="searchBox">
                        <BiSearch size={20} />
                        <input type="text" value={userSelectSearch} onChange={(e) => setUserSelectSearch(e.target.value)} className="searchInput" placeholder="Search User" />
                    </div>
                    <div className="selectedUserContainer">
                        {users.length > 0 && <h4>Selected User</h4>}
                        {users && users.map((user) => (
                            <UserItem key={user.id} result={user} resultClickHandler={resultClickHandler} />
                        ))}
                    </div>
                    <div className="searchResultContainer">

                        {userSelectSearchResults.length > 0 && <hr className="resultDivider" />}
                        <h4>Search Result</h4>
                        {userSelectSearchResults.length > 0 && userSelectSearchResults.map((result) => (
                            <UserItem key={result.id} result={result} resultClickHandler={resultClickHandler} />
                        ))}
                    </div>
                </div>
                <button className="createGroupBtn" onClick={(e) => { createGroupHandler(groupName, users) }}>Create</button>
            </div>
        </div>
    )


}