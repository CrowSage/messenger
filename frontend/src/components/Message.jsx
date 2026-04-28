export default function Message({ content, created_at, sender }) {

    const formattedDate = new Date(created_at).toLocaleString()

    return (
        <span className="message" >
            <span>Sender: {sender}</span><br />
            <span>Date: {formattedDate}</span><br />
            <strong>Message{content}</strong><br />
        </span>
    )
}