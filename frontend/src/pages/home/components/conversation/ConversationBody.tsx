import { useEffect, useState } from "react"
import "./main.css"
import { dummyMessages } from "../../../../dummy-data"
import { useSelector } from "react-redux"

const ConversationBody = ({ user }: any) => {

    console.log(user)
    const currentUser = useSelector((state: any) => state?.user)

    const [messages, setMessages] = useState<any[]>([])


    useEffect(() => {
        setMessages(dummyMessages)
    }, [])

    return (
        <>
            <div className="conversationBody">
                <div className="background">

                </div>
            </div>
        </>
    )
}

export default ConversationBody