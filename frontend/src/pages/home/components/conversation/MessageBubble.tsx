import { useSelector } from "react-redux"
import { Status } from "../chat/SingleContact"
import { timeAgo } from "../../../../utils/functions"
import AudioMessage from "./AudioMessage"

export const Media = ({ messageType, content }: any) => {

    return (
        <>
            {messageType === "image" && <img src={content} alt="photo-message" className="photo-message" />}
            {messageType === "video" && <video src={content} className="video-message" controls />}
            {messageType === "audio" && <AudioMessage audioUrl={content} />}
        </>
    )
}

export const RightChat = ({ data }: any) => {

    return (
        <>
            <div className="rightChatBubble">
                {
                    data?.messageType !== "text" && <Media messageType={data?.messageType} content={data?.contentUrl} />
                }
                {
                    (data?.text && data?.messageType !== "audio") ? <p>{data?.text}</p> : null
                }
                <TimeAndRead chat="right" status={data?.status} time={data?.time} />
            </div>
        </>
    )
}

export const LeftChat = ({ data }: any) => {

    return (
        <>
            <div className="leftChatBubble">
                {
                    data?.messageType !== "text" && <Media messageType={data?.messageType} content={data?.contentUrl} />
                }
                {
                    (data?.text && data?.messageType !== "audio") ? <p>{data?.text}</p> : null
                }
                <TimeAndRead chat="left" status={data?.status} time={data?.time} />
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

const MessageBubble = ({ data }: any) => {

    const currentUser = useSelector((state: any) => state?.user)

    return (
        <>
            {
                data?.from_id === currentUser?._id ? <RightChat data={data} /> : <LeftChat data={data} />
            }
        </>
    )
}

export default MessageBubble