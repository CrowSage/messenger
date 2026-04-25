export default function Message({ content, date_created, sender, messageId }) {


    return (
        <span className="message" >
            {sender}, {date_created}
            <strong>{content}</strong>
        </span>
    )
}