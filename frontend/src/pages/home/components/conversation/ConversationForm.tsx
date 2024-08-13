import "./main.css"
import { IconButton } from "@mui/material";
import { FaMicrophone } from "react-icons/fa";
import { BsEmojiSmile } from "react-icons/bs";
import { GrAttachment } from "react-icons/gr";
import { IoSendSharp } from "react-icons/io5";
import { useEffect, useRef, useState } from "react";
import EmojiPicker, { EmojiClickData } from 'emoji-picker-react';

const ConversationForm = ({ user }: any) => {

    const emojiPickerRef = useRef<HTMLDivElement>(null);

    const [chatInput, setChatInput] = useState<string>("")
    const [showEmojiPicker, setShowEmojiPicker] = useState<boolean>(false)

    useEffect(() => {

        const handleClickOutside = (event: MouseEvent) => {
            if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target as Node)) {
                setShowEmojiPicker(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };

    }, [emojiPickerRef]);

    const handleEmojiClick = (emojiData: EmojiClickData) => setChatInput((prevInput) => prevInput + emojiData.emoji);

    const sendMessage = async (e: any) => {
        e?.preventDefault()
        console.log(chatInput, user)
    }

    return (
        <>
            <form className="conversationForm" onSubmit={sendMessage}>
                <>
                    {
                        showEmojiPicker ?
                            <div className="emojiPickerCont" ref={emojiPickerRef}>
                                <EmojiPicker searchPlaceHolder="Search emoji" onEmojiClick={handleEmojiClick} />
                            </div>
                            : null
                    }
                </>
                <IconButton onClick={() => setShowEmojiPicker(!showEmojiPicker)} ><BsEmojiSmile /></IconButton>
                <IconButton><GrAttachment /></IconButton>
                <input type="text" value={chatInput} placeholder="Type a message" onChange={(e: any) => setChatInput(e?.target?.value)} />
                {
                    chatInput ? <IconButton><IoSendSharp /></IconButton> : <IconButton><FaMicrophone /></IconButton>
                }
            </form>
        </>
    )
}

export default ConversationForm