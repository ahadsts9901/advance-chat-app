import "./main.css"
import { useEffect } from "react"
import MessageBubble from "./MessageBubble"
import axios from "axios"
import { baseUrl, chatMessageChannel } from "../../../../core"
import io from 'socket.io-client';
import { useSelector } from "react-redux"

const ConversationBody = ({ user, messages, setMessages }: any) => {

    const currentUser = useSelector((state: any) => state?.user)

    useEffect(() => {

        const socket = io(baseUrl);

        const getMessages = async () => {

            try {
                setMessages([])
                const resp = await axios.get(`${baseUrl}/api/v1/chats/${user?._id}`, { withCredentials: true })
                setMessages(resp?.data?.data)
            } catch (error) {
                console.error(error)
            }

        };

        const listenSocketChannel = () => {
            socket.on('connect', () => console.log("socket connected"))
            socket.on('disconnect', (message) => console.log("socket disconnected: ", message))
            socket.on(`${chatMessageChannel}-${currentUser?._id}`, (e: any) => setMessages((oldMessages: any) => [e, ...oldMessages]))
        }

        getMessages()
        listenSocketChannel()

        return () => {
            socket.off(`${chatMessageChannel}-${currentUser?._id}`)
            socket.disconnect();
        }

    }, [user?._id]);

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