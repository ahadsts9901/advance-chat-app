import "./Main.css"
import { IoSearch } from "react-icons/io5"
import { RxCross2 } from "react-icons/rx"
import { IoArrowBackSharp } from "react-icons/io5"
import { useState } from "react"
import { IconButton } from "@mui/material"
import {groupUsersByLetter} from "../../../../../utils/functions"

const ContactSearchBar = ({ setShowChatSearch, users, setFilteredUsers }: any) => {
    const [text, setText] = useState("")

    const searchContacts = (text: string) => {
        setText(text)
        if (!text || text.trim() === "") {
            setFilteredUsers(groupUsersByLetter(users)) // Reset to the original grouped users when search is cleared
            return
        }

        const filtered = users.filter((user: any) =>
            user.userName.toLowerCase().includes(text.toLowerCase())
        )

        setFilteredUsers(groupUsersByLetter(filtered)) // Update with filtered users
    }

    return (
        <>
            <div className="chatSearchBar">
                <IconButton onClick={() => setShowChatSearch(false)} size="small">
                    <IoArrowBackSharp />
                </IconButton>
                <div className="searchBar">
                    <IoSearch />
                    <input
                        value={text}
                        type="text"
                        placeholder="Search contacts"
                        onChange={(e: any) => searchContacts(e.target.value)}
                    />
                    {text && (
                        <IconButton onClick={() => searchContacts("")} size="small">
                            <RxCross2 style={{ fontSize: "0.4em" }} />
                        </IconButton>
                    )}
                </div>
            </div>
        </>
    )
}

export default ContactSearchBar