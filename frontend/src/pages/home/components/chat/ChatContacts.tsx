import "./main.css"
import { dummyContacts } from "../../../../dummy-data"
import { useEffect, useState } from "react"
import SingleContact from "./SingleContact"

const ChatContacts = ({ userId }: any) => {

    const [contacts, setContacts] = useState<any[]>([])

    useEffect(() => {
        setContacts(dummyContacts)
    }, [])

    return (
        <>
            <div className="contactsContainer">
                {
                    contacts?.map((contact: any, i: number) => <SingleContact key={i} data={contact} userId={userId} />)
                }
            </div>
        </>
    )
}

export default ChatContacts