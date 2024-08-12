import ChatContacts from "./chat/ChatContacts"
import ChatHeader from "./chat/ChatHeader"
import ChatSearch from "./chat/ChatSearch"

const Chats = () => {
    return (
        <>
            <ChatHeader />
            <ChatSearch />
            <ChatContacts />
        </>
    )
}

export default Chats