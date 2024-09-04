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
        console.log("delete for everyone")
    }

    const copyMessage = () => copyText(data?.text, handleClose)

    const myOptions = [
        { label: "Delete for me", fun: deleteForMEConfirmation },
        { label: "Delete for everyone", fun: deleteForEveryoneConfirmation },
        { label: "Edit", fun: () => console.log("edit") },
        { label: "Copy", fun: copyMessage },
    ]

    const opponentOptions = [
        { label: "Delete for me", fun: deleteForMEConfirmation },
        { label: "Copy", fun: copyMessage },
    ]

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

const MessageBubble = ({ data, user, setMessages, getContacts }: any) => {

    const currentUser = useSelector((state: any) => state?.user)

    return (
        <>
            {
                data?.from_id === currentUser?._id ? <RightChat data={data} image={currentUser?.profilePhoto} setMessages={setMessages} getContacts={getContacts} /> : <LeftChat data={data} image={user?.profilePhoto} setMessages={setMessages} getContacts={getContacts} />
            }
        </>
    )
}

export default MessageBubble