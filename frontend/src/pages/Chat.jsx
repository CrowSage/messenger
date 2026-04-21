import { useParams } from "react-router-dom"
import Sidebar from "../components/Sidebar"
import ChatWindow from "../components/ChatWindow"


export default function Chat() {


    // Variables
    const { chatId } = useParams()

    // UseEffects

    // Functions

    // Returning
    return (
        <div className="mainChat">
            <Sidebar />
            {chatId && <ChatWindow chatId={chatId} />}
        </div>
    )
}