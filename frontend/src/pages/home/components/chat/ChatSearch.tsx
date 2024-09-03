import "./main.css";
import { IconButton } from "@mui/material";
import { MdFilterList } from "react-icons/md";
import { IoSearch } from "react-icons/io5";

const ChatSearch = ({ contacts, setContacts }: any) => {

    const backupContacts = contacts

    const searchContacts = (text: string) => {

        if (!text || text.trim() === "") {
            setContacts(backupContacts);
            return;
        }

        const filteredContacts = backupContacts.filter((contact: any) =>
            contact.userName.toLowerCase().includes(text.toLowerCase()) ||
            contact.lastMessage.toLowerCase().includes(text.toLowerCase()) ||
            contact.messageType.toLowerCase().includes(text.toLowerCase())
        );

        setContacts(filteredContacts);
    };

    return (
        <>
            <div className="chatSearchContainer">
                <div className="searchBar">
                    <IoSearch />
                    <input
                        type="text"
                        placeholder="Search or start new chat"
                        onChange={(e: any) => searchContacts(e.target.value)}
                    />
                </div>
                <IconButton><MdFilterList /></IconButton>
            </div>
        </>
    );
};

export default ChatSearch;