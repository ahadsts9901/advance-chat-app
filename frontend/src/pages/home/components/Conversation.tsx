import "./main.css"
import ConversationBody from "./conversation/ConversationBody"
import ConversationForm from "./conversation/ConversationForm"
import ConversationHeader from "./conversation/ConversationHeader"
import ConversationSplash from "./conversation/ConversationSplash"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import { baseUrl } from "../../../core"
import { useEffect, useState } from "react"

const Conversation = ({ userId }: any) => {

    const navigate = useNavigate()

    const [user, setUser] = useState<any>(null)
    const [messages, setMessages] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState<boolean>(false)

    useEffect(() => {
        getUserData()
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

    return (
        <>
            <div className="conversationSection">
                {
                    (!userId || !user || isLoading) ? <ConversationSplash /> :
                        <>
                            <ConversationHeader user={user} />
                            <ConversationBody user={user} messages={messages} setMessages={setMessages} />
                            <ConversationForm user={user} setMessages={setMessages} />
                        </>
                }
            </div>
        </>
    )
}

export default Conversation