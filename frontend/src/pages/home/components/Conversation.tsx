import "./main.css"
import ConversationBody from "./conversation/ConversationBody"
import ConversationForm from "./conversation/ConversationForm"
import ConversationHeader from "./conversation/ConversationHeader"
import ConversationSplash from "./conversation/ConversationSplash"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import { baseUrl } from "../../../core"
import { useEffect, useState } from "react"

const Conversation = ({ userId, getContacts, setFilteredContacts }: any) => {

    const navigate = useNavigate()

    const [user, setUser] = useState<any>(null)
    const [messages, setMessages] = useState<any[]>([])
    const [originalMessages, setOriginalMessages] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [searchText, setSearchText] = useState<string>("")

    useEffect(() => {
        getUserData()
        markRead(userId)
    }, [userId])

    const getUserData = async () => {

        try {

            setIsLoading(true)

            const resp = await axios.get(`${baseUrl}/api/v1/profile/${userId}`, { withCredentials: true })
            setUser(resp?.data?.data)
            setIsLoading(false)

        } catch (error) {
            console.error(error)
            setIsLoading(false)
            navigate("/")
        }

    }

    const markRead = async (id: string) => {

        if (!id || id?.trim() === "") return

        try {

            await axios.put(`${baseUrl}/api/v1/mark-messages-read/${id}`, {}, {
                withCredentials: true
            })

        } catch (error) {
            console.error(error)
        }

    }

    return (
        <>
            <div className="conversationSection">
                {
                    (!userId || !user || isLoading) ? <ConversationSplash /> :
                        <>
                            <ConversationHeader user={user} setMessages={setMessages} getContacts={getContacts} setUser={setUser} setSearchText={setSearchText} searchText={searchText} />
                            <ConversationBody user={user} messages={messages} setMessages={setMessages} searchText={searchText} getContacts={getContacts} originalMessages={originalMessages} setOriginalMessages={setOriginalMessages} />
                            <ConversationForm user={user} setMessages={setMessages} setFilteredContacts={setFilteredContacts} setSearchText={setSearchText} searchText={searchText} setOriginalMessages={setOriginalMessages} />
                        </>
                }
            </div>
        </>
    )
}

export default Conversation