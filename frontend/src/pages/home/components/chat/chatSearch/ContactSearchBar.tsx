import "./Main.css"
import { IoSearch } from "react-icons/io5"
import { RxCross2 } from "react-icons/rx"
import { IoArrowBackSharp } from "react-icons/io5"
import { useState } from "react"
import { IconButton } from "@mui/material"

const ContactSearchBar = ({ setShowChatSearch, users, setUsers }: any) => {

    const [text, setText] = useState("")

    const searchContacts = (text: string) => {

        setText(text)
        if (!text || text?.trim() === "") return

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
                        onChange={(e: any) => searchContacts(e?.target?.value)}
                    />
                    {
                        text ?
                            <IconButton onClick={() => setText("")} size="small">
                                <RxCross2 style={{ fontSize: "0.4em" }} />
                            </IconButton>
                            : null
                    }
                </div>
            </div>
        </>
    )
}

export default ContactSearchBar