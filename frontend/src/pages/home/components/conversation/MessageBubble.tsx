import { useSelector } from "react-redux"
import { Status } from "../chat/SingleContact"
import { timeAgo } from "../../../../utils/functions"
import AudioMessage from "./AudioMessage"

export const Media = ({ messageType, content, image }: any) => {

    return (
        <>
            {messageType === "image" && <img src={content} alt="photo-message" className="photo-message" />}
            {messageType === "video" && <video src={content} className="video-message" controls />}
            {messageType === "audio" && <AudioMessage audioUrl={content} image={image} />}
        </>
    )
}

export const RightChat = ({ data, image }: any) => {

    return (
        <>
            <div className="rightChatBubble">
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