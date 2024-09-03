import "./main.css";
import { useState, useEffect } from "react";
import { IconButton } from "@mui/material";
import { MdFilterList } from "react-icons/md";
import { IoSearch } from "react-icons/io5";
import ContactSearchParent from "./chatSearch/ContactSearchParent";

const ChatSearch = ({ contacts, setFilteredContacts }: any) => {

    const [backupContacts, setBackupContacts] = useState([]);
    const [showChatSearch, setShowChatSearch] = useState(false)

    useEffect(() => {
        setBackupContacts(contacts);
        setFilteredContacts(contacts);
    }, [contacts]);

    const searchContacts = (text: string) => {

        if (!text || text.trim() === "") {
            setFilteredContacts(backupContacts);
            return;
        }

        const filtered = backupContacts.filter((contact: any) =>
            contact.userName.toLowerCase().includes(text.toLowerCase()) ||
            contact.lastMessage.toLowerCase().includes(text.toLowerCase()) ||
            contact.messageType.toLowerCase().includes(text.toLowerCase())
        );

        setFilteredContacts(filtered);

    };

    return (
        <>
            {showChatSearch && <ContactSearchParent setShowChatSearch={setShowChatSearch} />}
            <div className="chatSearchContainer">
                <div className="searchBar">
                    <IoSearch />
                    <input
                        type="text"
                        placeholder="Search or start new chat"
                        onChange={(e: any) => searchContacts(e?.target?.value)}
                    />
                </div>
                <IconButton onClick={() => setShowChatSearch(true)}><MdFilterList /></IconButton>
            </div>
        </>
    );
};

export default ChatSearch;