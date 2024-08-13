import "./main.css"
import { IconButton } from "@mui/material";
import { FaMicrophone } from "react-icons/fa";
import { BsEmojiSmile } from "react-icons/bs";
import { GrAttachment } from "react-icons/gr";
import { IoSendSharp } from "react-icons/io5";
import { useState } from "react";

const ConversationForm = ({ user }: any) => {

    const [chatInput, setChatInput] = useState<null | string>(null)

    const sendMessage = async (e: any) => {
        e?.preventDefault()
        console.log(chatInput, user)
    }

    return (
        <>
            <form className="conversationForm" onSubmit={sendMessage}>
                <IconButton><BsEmojiSmile /></IconButton>
                <IconButton><GrAttachment /></IconButton>
                <input type="text" placeholder="Type a message" onChange={(e: any) => setChatInput(e?.target?.value)} />
                {
                    chatInput ? <IconButton><IoSendSharp /></IconButton> : <IconButton><FaMicrophone /></IconButton>
                }
            </form>
        </>
    )
}

export default ConversationForm