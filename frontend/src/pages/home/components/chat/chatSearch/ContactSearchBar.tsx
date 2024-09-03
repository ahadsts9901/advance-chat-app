import "./Main.css"
import { IoSearch } from "react-icons/io5"
import { RxCross2 } from "react-icons/rx";
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
                        value={text}
                        type="text"
                        placeholder="Search contacts"
                        onChange={(e: any) => searchContacts(e?.target?.value)}
                    />
                    {
                        text ?
                            <RxCross2 onClick={() => setText("")} />
                            : null
                    }
                </div>
            </div>
        </>
    )
}

export default ContactSearchBar