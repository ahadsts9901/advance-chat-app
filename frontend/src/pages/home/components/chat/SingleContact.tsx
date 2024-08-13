import "./main.css"
import fallBackProfileImage from "/default_avatar.png"
import DoneIcon from '@mui/icons-material/Done';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import { FaCamera } from "react-icons/fa";
import { FaVideo } from "react-icons/fa6";
import { FaMicrophone } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { timeAgo } from "../../../../utils/functions";

export const Status = ({ status }: any) => {

    return (
        <>
            <div className="readReciepts">
                {status === "sent" && <DoneIcon className="sent" />}
                {status === "delievered" && <DoneAllIcon className="delievered" />}
                {status === "read" && <DoneAllIcon className="read" />}
            </div>
        </>
    )

}

const MessageType = ({ lastMessage, messageType }: any) => {

    return (
        <>
            <div className="messageType">
                {messageType === "text" && lastMessage && <p>{lastMessage?.length > 15 ? `${lastMessage?.substr(0, 20)}...` : lastMessage}</p>}
                {messageType === "image" && <><FaCamera style={{ marginRight: "2px" }} /><p>Photo</p></>}
                {messageType === "video" && <><FaVideo style={{ marginRight: "2px" }} /><p>Video</p></>}
                {messageType === "audio" && <><FaMicrophone style={{ marginRight: "2px" }} /><p>Audio</p></>}
            </div>
        </>
    )

}

const SingleContact = ({ data, userId }: any) => {

    const navigate = useNavigate()

    return (
        <>
            <div className={`singleContact ${data?._id === userId ? "special-singleContact" : ""}`}
                onClick={() => navigate(`/chat/${data?._id}`)}
            >
                <div>
                    <img src={data?.profilePhoto} alt="profile-photo"
                        onError={(e: any) => {
                            e.target.src = fallBackProfileImage
                            e.target.style.padding = "0.4em"
                        }}
                    />
                    <div>
                        <h4>{data?.userName}</h4>
                        <div>
                            {!data?.isRecieved ? <Status status={data?.status} /> : null}
                            <MessageType lastMessage={data?.lastMessage} messageType={data?.messageType} />
                        </div>
                    </div>
                    <p className="messageTime">{timeAgo(data?.time)}</p>
                </div>
            </div>
        </>
    )
}

export default SingleContact