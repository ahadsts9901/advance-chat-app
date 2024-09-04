import "./main.css"
import { useSelector } from "react-redux"
import { Status } from "../chat/SingleContact"
import { copyText, timeAgo } from "../../../../utils/functions"
import AudioMessage from "./AudioMessage"
import ConfirmAlertMUI from "../../../../components/mui/ConfirmAlert"
import { useState } from "react"
import { IconButton, Menu, MenuItem } from "@mui/material"
import { FaChevronDown } from "react-icons/fa";
import axios from "axios"
import { baseUrl } from "../../../../core"
import moment from "moment"
import FormDialogue from "../../../../components/mui/FormDialogue"

export const Media = ({ messageType, content, image }: any) => {

    return (
        <>
            {messageType === "image" && <img src={content} alt="photo-message" className="photo-message" />}
            {messageType === "video" && <video src={content} className="video-message" controls />}
            {messageType === "audio" && <AudioMessage audioUrl={content} image={image} />}
        </>
    )
}

export const DropMenu = ({ data, setMessages, getContacts }: any) => {

    const currentUser = useSelector((state: any) => state?.user)

    const [alertData, setAlertdata] = useState<any>(null)
    const [isAlertOpen, setIsAlertOpen] = useState<boolean>(false)
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [showEditDialogue, setShowEditDialogue] = useState<boolean>(false)
    const [editText, setEditText] = useState<null | string>(null)

    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event?.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const deleteForMEConfirmation = () => {

        setIsAlertOpen(true)
        setAlertdata({
            title: "Delete for me?",
            description: "Are you sure you want to delete this message?. The action cannot be undone",
            fun: deleteForMe,
        })
        handleClose()

    }

    const deleteForMe = async () => {

        if (!data?._id || data?._id?.trim() === "") return

        try {

            setIsLoading(true)
            await axios.put(`${baseUrl}/api/v1/delete-message-for-me/${data?._id}`, {}, {
                withCredentials: true
            })
            setMessages((oldMessages: any) => oldMessages?.filter((message: any) => message?._id?.toString() !== data?._id?.toString()))
            setIsLoading(false)
            setIsAlertOpen(false)
            await getContacts()

        } catch (error) {
            console.error(error)
            setIsLoading(false)
        }

    }

    const deleteForEveryoneConfirmation = () => {

        setIsAlertOpen(true)
        setAlertdata({
            title: "Delete for everyone?",
            description: "Are you sure you want to unsend this message?. The action cannot be undone",
            fun: deleteForEveryone,
        })
        handleClose()

    }

    const deleteForEveryone = async () => {

        if (!data?._id || data?._id?.trim() === "") return

        try {

            setIsLoading(true)
            await axios.put(`${baseUrl}/api/v1/delete-message-for-everyone/${data?._id}`, {}, {
                withCredentials: true
            })
            setMessages((oldMessages: any) =>
                oldMessages.map((message: any) =>
                    message?._id?.toString() === data?._id?.toString()
                        ? { ...message, isUnsend: true }
                        : message
                )
            );
            setIsLoading(false)
            setIsAlertOpen(false)
            await getContacts()

        } catch (error) {
            console.error(error)
            setIsLoading(false)
        }

    }

    const editMessageConfirmation = () => {

        setEditText(data?.text)
        setShowEditDialogue(true)
        handleClose()

    }

    const editMessage = async () => {

        if (!data?._id || data?._id?.trim() === "") return
        if (!editText || editText?.trim() === "") return

        try {

            setIsLoading(true)

            const resp = await axios.put(`${baseUrl}/api/v1/chats/${data?._id}`, {
                text: editText
            }, { withCredentials: true })

            setMessages((oldMessages: any) =>
                oldMessages?.map((message: any) =>
                    message?._id?.toString() === data?._id?.toString() ?
                        { ...resp?.data?.data, text: editText?.trim() } : message
                )
            );

            setIsLoading(false)
            setShowEditDialogue(false)
            await getContacts()

        } catch (error) {
            console.error(error)
            setIsLoading(false)
        }

    }

    const copyMessage = () => copyText(data?.text, handleClose)

    const isEditTimeExpired = moment().diff(moment(data?.createdOn), 'minutes') > 5;

    const myOptions = [
        { label: "Delete for me", fun: deleteForMEConfirmation },
        { label: "Delete for everyone", fun: deleteForEveryoneConfirmation },
        ...((!isEditTimeExpired && data?.text && data?.text?.length) ? [{ label: "Edit", fun: editMessageConfirmation }] : []),
        ...((data?.text && data?.text?.length) ? [{ label: "Copy", fun: copyMessage }] : []),
    ]

    const opponentOptions = [
        { label: "Delete for me", fun: deleteForMEConfirmation },
    ]

    if (!data?.isUnsend) {
        opponentOptions?.push({ label: "Copy", fun: copyMessage },)
    }

    const options = currentUser?._id?.toString() === data?.from_id?.toString() ? myOptions : opponentOptions

    return (
        <>
            <ConfirmAlertMUI
                open={isAlertOpen}
                setOpen={setIsAlertOpen}
                title={alertData?.title}
                description={alertData?.description}
                fun={alertData?.fun}
                isLoading={isLoading}
            />
            <FormDialogue
                open={showEditDialogue}
                setOpen={setShowEditDialogue}
                text={editText}
                setText={setEditText}
                fun={editMessage}
                isLoading={isLoading}
            />
            <div className="drop-message-button">
                <IconButton
                    aria-label="more"
                    id="long-button"
                    aria-controls={open ? 'long-menu' : undefined}
                    aria-expanded={open ? 'true' : undefined}
                    aria-haspopup="true"
                    onClick={handleClick}
                    size="small"
                >
                    <FaChevronDown style={{ fontSize: "0.5em" }} />
                </IconButton>
                <Menu
                    id="long-menu"
                    MenuListProps={{
                        'aria-labelledby': 'long-button',
                    }}
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleClose}
                >
                    {options?.map((option: any, i: number) => (
                        <MenuItem key={i} onClick={option?.fun} sx={{ fontSize: "0.7em", padding: "1em" }}>
                            {option?.label}
                        </MenuItem>
                    ))}
                </Menu>
            </div>
        </>
    );

}

export const RightChat = ({ data, image, setMessages, getContacts }: any) => {

    return (
        <>
            <div className="rightChatBubble">
                <DropMenu data={data} setMessages={setMessages} getContacts={getContacts} />
                {
                    data?.messageType !== "text" && <Media image={image} messageType={data?.messageType} content={data?.contentUrl} />
                }
                {data?.text && data?.messageType !== "audio" ? (
                    <p dangerouslySetInnerHTML={{ __html: data?.text }} />
                ) : null}
                <TimeAndRead chat="right" status={data?.status} time={data?.createdOn} />
            </div>
        </>
    )
}

export const LeftChat = ({ data, image, setMessages, getContacts }: any) => {

    return (
        <>
            <div className="leftChatBubble">
                <DropMenu data={data} setMessages={setMessages} getContacts={getContacts} />
                {
                    data?.messageType !== "text" && <Media image={image} messageType={data?.messageType} content={data?.contentUrl} />
                }
                {data?.text && data?.messageType !== "audio" ? (
                    <p dangerouslySetInnerHTML={{ __html: data?.text }} />
                ) : null}
                <TimeAndRead chat="left" status={data?.status} time={data?.createdOn} />
            </div>
        </>
    )
}

export const TimeAndRead = ({ chat, status, time }: any) => {
    return (
        <>
            <div className="timeAndRead">
                <p className="time">{timeAgo(time)}</p>
                {chat === "right" && <Status status={status} />}
            </div>
        </>
    )
}

export const UnsendRight = ({ messageId, setMessages, getContacts }: any) => {
    return (
        <>
            <div className="unSendRight">
                <DropMenu data={{ _id: messageId, isUnsend: true }} setMessages={setMessages} getContacts={getContacts} />
                <p>{`⦸ You deleted this message`}</p>
            </div>
        </>
    )
}

export const UnsendLeft = ({ messageId, setMessages, getContacts }: any) => {
    return (
        <>
            <div className="unSendLeft">
                <DropMenu data={{ _id: messageId, isUnsend: true }} setMessages={setMessages} getContacts={getContacts} />
                <p>{`⦸ This message was deleted`}</p>
            </div>
        </>
    )
}

export const UnsendMessage = ({ messageId, senderId, setMessages, getContacts }: any) => {

    const currentUser = useSelector((state: any) => state?.user)

    return (
        <>
            {
                senderId?.toString() === currentUser?._id?.toString() ?
                    <UnsendRight messageId={messageId} setMessages={setMessages} getContacts={getContacts} /> :
                    <UnsendLeft messageId={messageId} setMessages={setMessages} getContacts={getContacts} />
            }
        </>
    )
}

const MessageBubble = ({ data, user, setMessages, getContacts }: any) => {

    const currentUser = useSelector((state: any) => state?.user)

    return (
        <>
            {
                data?.isUnsend ? <UnsendMessage messageId={data?._id} senderId={data?.from_id} setMessages={setMessages} getContacts={getContacts} /> :
                    data?.from_id === currentUser?._id ? <RightChat data={data} image={currentUser?.profilePhoto} setMessages={setMessages} getContacts={getContacts} /> : <LeftChat data={data} image={user?.profilePhoto} setMessages={setMessages} getContacts={getContacts} />
            }
        </>
    )
}

export default MessageBubble