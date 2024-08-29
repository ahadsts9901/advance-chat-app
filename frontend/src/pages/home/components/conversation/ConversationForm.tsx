import "./main.css"
import { IconButton } from "@mui/material";
import { FaMicrophone } from "react-icons/fa";
import { BsEmojiSmile } from "react-icons/bs";
import { GrAttachment } from "react-icons/gr";
import { IoSendSharp } from "react-icons/io5";
import { useEffect, useRef, useState } from "react";
import EmojiPicker, { EmojiClickData } from 'emoji-picker-react';
import { RxCross2 } from "react-icons/rx";
import { formatFileSize } from "../../../../utils/functions";
import CaptureAudio from "./CaptureAudio";

const SelectedFile = ({ file, setFile }: any) => {

    return (
        <>
            <div className="fileCont">
                <IconButton onClick={() => setFile(null)}><RxCross2 /></IconButton>
                <div>
                    <p>{file?.name?.length > 30 ? `${file?.name?.substr(0, 30)}...` : file?.name}</p>
                    <h5>{formatFileSize(file?.size)}</h5>
                </div>
            </div>
        </>
    )

}

const ConversationForm = ({ user }: any) => {

    const emojiPickerRef = useRef<HTMLDivElement>(null);
    const fileInputRef: any = useRef(null)

    const [chatInput, setChatInput] = useState<string>("")
    const [showEmojiPicker, setShowEmojiPicker] = useState<boolean>(false)
    const [file, setFile] = useState<any>(null)
    const [showAudioRecorder, setShowAudioRecorder] = useState<boolean>(false)

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

        console.log("chatInput", chatInput)
        console.log("user", user)
        console.log("file", file)
    }

    return (
        <>
            {file && <SelectedFile file={file} setFile={setFile} />}
            {
                showAudioRecorder ?
                    <>
                        {showAudioRecorder && <CaptureAudio sendMessage={sendMessage} setFile={setFile} setShowAudioRecorder={setShowAudioRecorder} />}
                    </>
                    :
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
                                (chatInput || file) ?
                                    <IconButton><IoSendSharp /></IconButton>
                                    :
                                    <IconButton onClick={() => setShowAudioRecorder(true)}><FaMicrophone /></IconButton>
                            }
                            <input type="file" hidden ref={fileInputRef} onChange={(e: any) => setFile(e?.target?.files[0])}
                                accept="image/*,video/*,audio/*"
                            />
                        </form>
                    </>
            }
        </>
    )
}

export default ConversationForm