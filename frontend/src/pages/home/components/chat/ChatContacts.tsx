import "./main.css"
import { useEffect } from "react"
import SingleContact from "./SingleContact"
const ChatContacts = ({ userId, getContacts, contacts }: any) => {

    useEffect(() => {
        getContacts()
    }, [userId])

    return (
        <>
            <div className="contactsContainer">
                {
                    contacts?.map((contact: any, i: number) => <SingleContact key={i} data={contact} userId={userId} getContacts={getContacts} contacts={contacts} />)
                }
            </div>
        </>
    )
}

export default ChatContacts