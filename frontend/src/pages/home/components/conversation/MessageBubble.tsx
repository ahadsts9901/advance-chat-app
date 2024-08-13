import { useSelector } from "react-redux"

export const LeftChat = ({ data }: any) => {
    return (
        <div className="chatBubble">Left</div>
    )
}

export const RightChat = ({ data }: any) => {
    return (
        <div className="chatBubble">Right</div>
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