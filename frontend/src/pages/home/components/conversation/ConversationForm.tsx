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
    const fileInputRef: any = useRef(null)

    const [chatInput, setChatInput] = useState<string>("")
    const [showEmojiPicker, setShowEmojiPicker] = useState<boolean>(false)
    const [files, setFiles] = useState<any>(null)

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
                <IconButton onClick={() => fileInputRef?.current?.click()}><GrAttachment /></IconButton>
                <input type="text" value={chatInput} placeholder="Type a message" onChange={(e: any) => setChatInput(e?.target?.value)} />
                {
                    (chatInput || files) ? <IconButton><IoSendSharp /></IconButton> : <IconButton><FaMicrophone /></IconButton>
                }
                <input type="file" hidden ref={fileInputRef} onChange={(e: any) => setFiles(e?.target?.files[0])} />
            </form>
        </>
    )
}

export default ConversationForm