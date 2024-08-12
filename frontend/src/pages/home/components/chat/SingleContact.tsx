import "./main.css"
import fallBackProfileImage from "/default_avatar.png"
import DoneIcon from '@mui/icons-material/Done';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import { FaCamera } from "react-icons/fa";
import { FaVideo } from "react-icons/fa6";
import { FaMicrophone } from "react-icons/fa";
import moment from "moment"

const Status = ({ status }: any) => {

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

const SingleContact = ({ data }: any) => {

    const timeAgo = (date: string) => {
        const now = moment();
        const momentDate = moment(date);
        const diffInHours = now.diff(momentDate, 'hours');

        if (diffInHours < 24) {
            return momentDate.format('h:mm A');
        } else {
            const diffInDays = now.diff(momentDate, 'days');
            if (diffInDays < 30) {
                return diffInDays === 1 ? '1 day ago' : `${diffInDays} days ago`;
            } else {
                const diffInMonths = now.diff(momentDate, 'months');
                if (diffInMonths < 12) {
                    return diffInMonths === 1 ? '1 month ago' : `${diffInMonths} months ago`;
                } else {
                    const diffInYears = now.diff(momentDate, 'years');
                    return diffInYears === 1 ? '1 year ago' : `${diffInYears} years ago`;
                }
            }
        }
    };

    return (
        <>
            <div className="singleContact">
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