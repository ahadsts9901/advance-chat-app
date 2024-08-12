import "./main.css"
import ConversationBody from "./conversation/ConversationBody"
import ConversationForm from "./conversation/ConversationForm"
import ConversationHeader from "./conversation/ConversationHeader"
import ConversationSplash from "./conversation/ConversationSplash"

const Conversation = ({ userId }: any) => {
    return (
        <>
            <div className="conversationSection">
                {
                    !userId ? <ConversationSplash /> :
                        <>
                            <ConversationHeader />
                            <ConversationBody />
                            <ConversationForm />
                        </>
                }
            </div>
        </>
    )
}

export default Conversation