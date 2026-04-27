export default function Message({ content, created_at, sender }) {

    const formattedDate = new Date(created_at).toLocaleString()

    return (
        <span className="message" >
            {sender}, {formattedDate}
            <strong>{content}</strong>
        </span>
    )
}