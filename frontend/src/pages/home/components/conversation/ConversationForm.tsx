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
import { baseUrl, imageMessageSize, videoMessageSize } from "../../../../core";
import { errorMessages } from "../../../../errorMessages";
import axios from "axios";

const SelectedFile = ({ file, setFile, fileSizeValidation, fileInputRef }: any) => {

    return (
        <>
            <div className="fileCont">
                <IconButton onClick={() => {
                    setFile(null)
                    if (fileInputRef?.current) fileInputRef.current.value = ''
                }}><RxCross2 /></IconButton>
                <div>
                    <p>{file?.name?.length > 30 ? `${file?.name?.substr(0, 30)}...` : file?.name}</p>
                    <h5>{formatFileSize(file?.size)}</h5>
                    <h6>{fileSizeValidation}</h6>
                </div>
            </div>
        </>
    )

}

const ConversationForm = ({ user, setMessages, setFilteredContacts, setOriginalMessages }: any) => {

    const emojiPickerRef = useRef<HTMLDivElement>(null);
    const fileInputRef: any = useRef(null)

    const [chatInput, setChatInput] = useState<string>("")
    const [showEmojiPicker, setShowEmojiPicker] = useState<boolean>(false)
    const [file, setFile] = useState<any>(null)
    const [showAudioRecorder, setShowAudioRecorder] = useState<boolean>(false)
    const [fileSizeValidation, setFileSizeValidation] = useState<null | string>(null)
    const [isLoading, setIsLoading] = useState<boolean>(false)

    useEffect(() => {

        const handleClickOutside = (event: MouseEvent) => {
            if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target as Node)) setShowEmojiPicker(false)
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };

    }, [emojiPickerRef]);

    const handleEmojiClick = (emojiData: EmojiClickData) => setChatInput((prevInput) => prevInput + emojiData.emoji);

    const sendMessage = async (e: any) => {

        e?.preventDefault()

        if (!file && !chatInput && chatInput?.trim() === "") return

        if (file?.type?.startsWith("image") && file?.size > imageMessageSize) {
            return setFileSizeValidation(errorMessages?.imageMessageSizeError)
        }

        if (file?.type?.startsWith("video") && file?.size > videoMessageSize) {
            return setFileSizeValidation(errorMessages?.videoMessageSizeError)
        }

        try {

            setIsLoading(true)
            setFileSizeValidation(null)

            const formData = new FormData()

            if (chatInput) formData?.append('text', chatInput)
            if (file) formData?.append('file', file)

            const resp = await axios.post(`${baseUrl}/api/v1/chats/${user?._id}`, formData, {
                withCredentials: true,
                headers: { "Content-Type": "multipart/form-data" },
            })

            setMessages((oldMessages: any) => [resp?.data?.data, ...oldMessages])
            setOriginalMessages((oldMessages: any) => [resp?.data?.data, ...oldMessages])
            setIsLoading(false)
            setFileSizeValidation(null)
            setChatInput("")
            setFile(null)
            setShowAudioRecorder(false)
            setFilteredContacts([])
            if (fileInputRef?.current) fileInputRef.current.value = ""

        } catch (error: any) {
            console.error(error)
            setIsLoading(false)
            setFileSizeValidation(error?.response?.data?.message)
        }

    }

    return (
        <>
            {file && <SelectedFile fileInputRef={fileInputRef} file={file} setFile={setFile} fileSizeValidation={fileSizeValidation} />}
            {
                showAudioRecorder ?
                    <>
                        {showAudioRecorder && <CaptureAudio isLoading={isLoading} sendMessage={sendMessage} setFile={setFile} setShowAudioRecorder={setShowAudioRecorder} />}
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
                                    <IconButton onClick={sendMessage} disabled={isLoading}><IoSendSharp /></IconButton>
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