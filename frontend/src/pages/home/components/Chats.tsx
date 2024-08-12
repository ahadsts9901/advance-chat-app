import "./main.css"
import ChatContacts from "./chat/ChatContacts"
import ChatHeader from "./chat/ChatHeader"
import ChatSearch from "./chat/ChatSearch"

const Chats = ({ userId }: any) => {
    return (
        <>
            <div className="chatSection">
                <ChatHeader />
                <ChatSearch />
                <ChatContacts userId={userId} />
            </div>
        </>
    )
}

export default Chats