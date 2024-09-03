import "./Main.css"
import { IoSearch } from "react-icons/io5"
import { RxCross2 } from "react-icons/rx"
import { IoArrowBackSharp } from "react-icons/io5"
import { useState } from "react"

const ContactSearchBar = ({ setShowChatSearch }: any) => {

    const [text, setText] = useState("")

    const searchContacts = (text: string) => {

        setText(text)
        if (!text || text?.trim() === "") return

    }

    return (
        <>
            <div className="chatSearchBar">
                <IoArrowBackSharp style={{ cursor: "pointer" }} onClick={() => setShowChatSearch(false)} />
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
                            <RxCross2 onClick={() => setText("")} style={{ cursor: "pointer" }} />
                            : null
                    }
                </div>
            </div>
        </>
    )
}

export default ContactSearchBar