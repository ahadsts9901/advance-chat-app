import "./main.css"
import { useEffect, useState } from "react"
import SingleContact from "./SingleContact"
import axios from "axios"
import { baseUrl } from "../../../../core"

const ChatContacts = ({ userId }: any) => {

    const [contacts, setContacts] = useState<any[]>([])

    useEffect(() => {
        getContacts()
    }, [])
    
    const getContacts = async () => {

        try {

            const resp = await axios.get(`${baseUrl}/api/v1/contacts`, { withCredentials: true })
            setContacts(resp?.data?.data)

        } catch (error) {
            console.error(error)
        }

    }

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