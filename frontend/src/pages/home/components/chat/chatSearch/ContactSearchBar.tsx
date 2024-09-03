import "./Main.css"
import { IoSearch } from "react-icons/io5"
import { useState } from "react"

const ContactSearchBar = () => {

    const [text, setText] = useState("")

    const searchContacts = (text: string) => {

        setText(text)
        if (!text || text?.trim() === "") return

    }

    return (
        <>
            <div className="chatSearchBar">
                <div className="searchBar">
                    <IoSearch />
                    <input
                        type="search"
                        placeholder="Search contacts"
                        onChange={(e: any) => searchContacts(e?.target?.value)}
                    />
                </div>
            </div>
        </>
    )
}

export default ContactSearchBar