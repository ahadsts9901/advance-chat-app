import { useSelector } from "react-redux"
import { Status } from "../chat/SingleContact"
import { timeAgo } from "../../../../utils/functions"
import AudioMessage from "./AudioMessage"
import ConfirmAlertMUI from "../../../../components/mui/ConfirmAlert"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { IconButton, Menu, MenuItem } from "@mui/material"
import { FaChevronDown } from "react-icons/fa";

export const Media = ({ messageType, content, image }: any) => {

    return (
        <>
            {messageType === "image" && <img src={content} alt="photo-message" className="photo-message" />}
            {messageType === "video" && <video src={content} className="video-message" controls />}
            {messageType === "audio" && <AudioMessage audioUrl={content} image={image} />}
        </>
    )
}

export const DropMenu = ({ data }: any) => {

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

    const myOptions = [
        { label: "Delete for me", fun: () => console.log("delete for me") },
        { label: "Delete for everyone", fun: () => console.log("delete for everyone") },
        { label: "Edit", fun: () => console.log("edit") },
        { label: "Copy", fun: () => console.log("copy") },
    ]

    const opponentOptions = [
        { label: "Delete for me", fun: () => console.log("delete for me") },
        { label: "Copy", fun: () => console.log("copy") },
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

export const RightChat = ({ data, image }: any) => {

    return (
        <>
            <div className="rightChatBubble">
                <DropMenu data={data} />
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

export const LeftChat = ({ data, image }: any) => {

    return (
        <>
            <div className="leftChatBubble">
                <DropMenu data={data} />
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

const MessageBubble = ({ data, user }: any) => {

    const currentUser = useSelector((state: any) => state?.user)

    return (
        <>
            {
                data?.from_id === currentUser?._id ? <RightChat data={data} image={currentUser?.profilePhoto} /> : <LeftChat data={data} image={user?.profilePhoto} />
            }
        </>
    )
}

export default MessageBubble