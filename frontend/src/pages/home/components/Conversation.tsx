import "./main.css"
import ConversationBody from "./conversation/ConversationBody"
import ConversationForm from "./conversation/ConversationForm"
import ConversationHeader from "./conversation/ConversationHeader"

const Conversation = () => {
    return (
        <>
            <div className="conversationSection">
                <ConversationHeader />
                <ConversationBody />
                <ConversationForm />
            </div>
        </>
    )
}

export default Conversation