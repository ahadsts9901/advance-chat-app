import "./main.css"
import { useEffect, useState } from "react"
import { dummyMessages } from "../../../../dummy-data"
import MessageBubble from "./MessageBubble"

const ConversationBody = ({ user }: any) => {

    const [messages, setMessages] = useState<any[]>([])

    useEffect(() => {
        setMessages(dummyMessages)
    }, [])

    return (
        <>
            <div className="conversationBody">
                <div className="background"></div>
                <div className="body">
                    {
                        messages?.map((message: any, i: number) => <MessageBubble key={i} data={message} />)
                    }
                </div>
            </div>
        </>
    )
}

export default ConversationBody