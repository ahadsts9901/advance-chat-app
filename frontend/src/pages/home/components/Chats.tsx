import "./main.css"
import ChatContacts from "./chat/ChatContacts"
import ChatHeader from "./chat/ChatHeader"
import ChatSearch from "./chat/ChatSearch"

const Chats = ({ userId, getContacts, setContacts, contacts }: any) => {

    return (
        <>
            <div className="chatSection">
                <ChatHeader />
                <ChatSearch contacts={contacts} setContacts={setContacts} />
                <ChatContacts userId={userId} getContacts={getContacts} contacts={contacts} />
            </div>
        </>
    )
}

export default Chats