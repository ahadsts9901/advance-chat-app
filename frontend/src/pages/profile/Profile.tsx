import "./Main.css"
import { useEffect, useState } from "react"
import { baseUrl } from "../../core"
import { useParams } from "react-router-dom"
import Chats from "../home/components/Chats"
import axios from "axios"
import ProfileSection from "./components/ProfileSection"
import ConversationSplash from "../home/components/conversation/ConversationSplash"

const Profile = () => {

    const { userId } = useParams()

    const [user, setUser] = useState<any>(null)
    const [contacts, setContacts] = useState<any[]>([])
    const [filteredContacts, setFilteredContacts] = useState([]);

    useEffect(() => {

        getProfile()

    }, [userId])

    const getContacts = async () => {

        try {

            const resp = await axios.get(`${baseUrl}/api/v1/contacts`, { withCredentials: true })
            setContacts(resp?.data?.data)
            setFilteredContacts(resp?.data?.data)

        } catch (error) {
            console.error(error)
        }

    }

    const getProfile = async () => {

        if (!userId || userId?.trim() === "") return

        try {

            setUser(null)
            const resp = await axios.get(`${baseUrl}/api/v1/profile/${userId}`, { withCredentials: true })
            setUser(resp?.data?.data)

        } catch (error) {
            console.error(error)
        }

    }

    return (
        <>
            <div className="profilePage">
                <Chats userId={userId} contacts={contacts} getContacts={getContacts} setContacts={setContacts} filteredContacts={filteredContacts} setFilteredContacts={setFilteredContacts} />
                {!user ? <ConversationSplash /> : <ProfileSection setUser={setUser} user={user} setContacts={setContacts} />}
            </div>
        </>
    )
}

export default Profile