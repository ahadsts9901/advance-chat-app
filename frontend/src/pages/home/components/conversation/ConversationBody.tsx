import "./main.css"
import { useEffect, useState } from "react"
// import { dummyMessages } from "../../../../dummy-data"
import MessageBubble from "./MessageBubble"
import axios from "axios"
import { baseUrl } from "../../../../core"

const ConversationBody = ({ user }: any) => {

    const [messages, setMessages] = useState<any[]>([])

    useEffect(() => {
        getMessages()
    }, [])

    const getMessages = async () => {

        try {

            const resp = await axios.get(`${baseUrl}/api/v1/chats/${user?._id}`, { withCredentials: true })
            setMessages(resp?.data?.data)

        } catch (error) {
            console.error(error)
        }

    }

    return (
        <>
            <div className="conversationBody">
                <div className="background"></div>
                <div className="body">
                    {
                        messages?.map((message: any, i: number) => <MessageBubble key={i} data={message} user={user} />)
                    }
                </div>
            </div>
        </>
    )
}

export default ConversationBody