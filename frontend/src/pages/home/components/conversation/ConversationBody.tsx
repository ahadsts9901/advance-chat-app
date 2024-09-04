import "./main.css"
import { useEffect, useState } from "react"
import MessageBubble from "./MessageBubble"
import axios from "axios"
import { baseUrl, chatMessageChannel, messageSeenChannel } from "../../../../core"
import io from 'socket.io-client';
import { useSelector } from "react-redux"

const ConversationBody = ({ user, messages, setMessages, originalMessages, setOriginalMessages, getContacts, searchText }: any) => {

    const currentUser = useSelector((state: any) => state?.user)

    useEffect(() => {

        const socket = io(baseUrl);

        const listenSocketChannel = () => {
            socket.on('connect', () => console.log("socket connected"))
            socket.on('disconnect', (message) => console.log("socket disconnected: ", message))
            socket.on(`${chatMessageChannel}-${currentUser?._id}`, async (e: any) => {
                await getContacts()
                await markDelivered()
                setMessages((oldMessages: any) =>
                    oldMessages.map((message: any) => {
                        if (
                            (message?.from_id?.toString() === currentUser?._id?.toString())
                            &&
                            (message?.status === "sent")
                        ) {
                            return { ...message, status: "delievered" };
                        }
                        return message;
                    })
                );
                if ((e?.from_id.toString() === user?._id?.toString() && e?.from_id != e?.to_id)) {
                    setMessages((oldMessages: any) => [e, ...oldMessages].map((message: any) => {
                        if (
                            (message?.from_id?.toString() === currentUser?._id?.toString())
                            &&
                            (message?.status === "sent" || message?.status === "delievered")
                        ) {
                            return { ...message, status: "seen" };
                        }
                        return message;
                    })
                    )
                    await markRead(user?._id)
                }
            })
            socket.on(`${messageSeenChannel}-${currentUser?._id}`, async (e: any) => {
                if (e?.opponentId?.toString() === currentUser?._id?.toString()) {
                    setMessages((oldMessages: any) =>
                        oldMessages.map((message: any) => {
                            if (
                                (message?.status === "sent")
                                ||
                                (message?.status === "delievered")
                            ) {
                                return { ...message, status: "seen" };
                            }
                            return message;
                        })
                    );
                }
            })
        }

        getMessages()
        listenSocketChannel()

        return () => {
            socket.off(`${chatMessageChannel}-${currentUser?._id}`)
            socket.disconnect();
        }

    }, [user?._id]);

    useEffect(() => {

        if (user?.isActive) {
            setMessages((oldMessages: any) =>
                oldMessages.map((message: any) => {
                    if (
                        (message?.from_id?.toString() === currentUser?._id?.toString())
                        &&
                        (message?.status === "sent")
                    ) {
                        return { ...message, status: "delievered" };
                    }
                    return message;
                })
            );
            getContacts()
        }

    }, [user])

    const getMessages = async () => {

        try {
            setMessages([])
            const resp = await axios.get(`${baseUrl}/api/v1/chats/${user?._id}`, { withCredentials: true })
            setMessages(resp?.data?.data)
            setOriginalMessages(resp?.data?.data)
        } catch (error) {
            console.error(error)
        }

    }

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

    useEffect(() => {
        searchMessages(searchText)
    }, [searchText])

    const getHighlightedText = (text: string, highlight: string) => {

        if (!highlight.trim()) return text;

        const escapedHighlight = highlight.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

        const regex = new RegExp(`(${escapedHighlight})`, 'gi');

        const parts = text.split(regex);

        return parts.map((part, i: number) =>
            regex.test(part) ? `<span style="background-color: #fcf003ab; color: #151515" key={${i}}>${part}</span>` : part
        ).join('');

    };

    const searchMessages = async (text: string) => {

        if (!text || text?.trim() === "") {
            await setMessages(originalMessages)
            return
        }

        setMessages(originalMessages)
        setMessages((oldMessages: any) =>
            oldMessages.map((message: any) => ({
                ...message,
                text: getHighlightedText(message.text, text)
            }))
        );
    }

    return (
        <>
            <div className="conversationBody">
                <div className="background"></div>
                <div className="body">
                    {
                        messages?.map((message: any, i: number) => <MessageBubble
                            key={i} data={message} user={user}
                        />)
                    }
                </div>
            </div>
        </>
    )
}

export default ConversationBody