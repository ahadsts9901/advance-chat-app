import { useSelector } from "react-redux"
import { Status } from "../chat/SingleContact"
import { timeAgo } from "../../../../utils/functions"

const Media = ({ messageType, content }: any) => {
    return (
        <>
            {messageType === "image" && <img src={content} alt="photo-message" className="photo-message" />}
            {messageType === "video" && <video src={content} className="video-message" controls />}
            {messageType === "audio" && <audio src={content} className="audio-message" controls />}
        </>
    )
}

export const RightChat = ({ data }: any) => {
    return (
        <>
            <div className="rightChatBubble">
                {
                    data?.messageType !== "text" && <Media messageType={data?.messageType} content={data?.content} />
                }
                {
                    (data?.text && data?.messageType !== "audio") ? <p>{data?.text}</p> : null
                }
                <TimeAndRead status={data?.status} time={data?.time} />
            </div>
        </>
    )
}

export const TimeAndRead = ({ status, time }: any) => {
    return (
        <>
            <div className="timeAndRead">
                <p className="time">{timeAgo(time)}</p>
                <Status status={status} />
            </div>
        </>
    )
}

export const LeftChat = ({ data }: any) => {

    return (
        <>
            <div className="leftChatBubble">
                {
                    data?.messageType !== "text" && <Media messageType={data?.messageType} content={data?.content} />
                }
                {
                    (data?.text && data?.messageType !== "audio") ? <p>{data?.text}</p> : null
                }
                <TimeAndRead status={data?.status} time={data?.time} />
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