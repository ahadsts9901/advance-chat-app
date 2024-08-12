import "./main.css"
import ChatContacts from "./chat/ChatContacts"
import ChatHeader from "./chat/ChatHeader"
import ChatSearch from "./chat/ChatSearch"

const Chats = () => {
    return (
        <>
            <div className="chatSection">
                <ChatHeader />
                <ChatSearch />
                <ChatContacts />
            </div>
        </>
    )
}

export default Chats