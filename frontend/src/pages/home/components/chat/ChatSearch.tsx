import "./main.css"
import { IconButton } from "@mui/material"
import { MdFilterList } from "react-icons/md";
import { IoSearch } from "react-icons/io5";

const ChatSearch = () => {
    return (
        <>
            <div className="chatSearchContainer">
                <div className="searchBar">
                    <IoSearch />
                    <input type="text" placeholder="Search or start new chat" />
                </div>
                <IconButton><MdFilterList /></IconButton>
            </div>
        </>
    )
}

export default ChatSearch