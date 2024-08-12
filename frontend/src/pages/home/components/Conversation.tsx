import ConversationBody from "./conversation/ConversationBody"
import ConversationForm from "./conversation/ConversationForm"
import ConversationHeader from "./conversation/ConversationHeader"

const Conversation = () => {
    return (
        <>
            <ConversationHeader />
            <ConversationBody />
            <ConversationForm />
        </>
    )
}

export default Conversation