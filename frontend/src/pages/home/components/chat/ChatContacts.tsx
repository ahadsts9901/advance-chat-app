import "./main.css"
import { useEffect } from "react"
import SingleContact from "./SingleContact"
import { useSelector } from "react-redux"
import axios from "axios"
import { baseUrl } from "../../../../core"
const ChatContacts = ({ userId, getContacts, contacts }: any) => {

    const currentUser = useSelector((state: any) => state?.user)

    useEffect(() => {
        getContacts()
        markDelivered()
    }, [userId])

    const markDelivered = async () => {

        if (currentUser?.isActive) {

            try {

                await axios.put(`${baseUrl}/api/v1/mark-messages-delievered`, {}, {
                    withCredentials: true
                })

            } catch (error) {
                console.error(error)
            }

        }

    }

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