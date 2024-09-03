import "./main.css"
import ChatContacts from "./chat/ChatContacts"
import ChatHeader from "./chat/ChatHeader"
import ChatSearch from "./chat/ChatSearch"

const Chats = ({ userId, getContacts, setContacts, contacts, filteredContacts, setFilteredContacts}: any) => {

    return (
        <>
            <div className="chatSection">
                <ChatHeader />
                <ChatSearch contacts={contacts} setContacts={setContacts} setFilteredContacts={setFilteredContacts} />
                <ChatContacts userId={userId} getContacts={getContacts} contacts={filteredContacts?.length ? filteredContacts : contacts} />
            </div>
        </>
    )
}

export default Chats