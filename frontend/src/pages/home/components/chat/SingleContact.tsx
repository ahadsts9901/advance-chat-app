import "./main.css"
import fallBackProfileImage from "/default_avatar.png"
import DoneIcon from '@mui/icons-material/Done';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import { FaCamera } from "react-icons/fa";
import { FaVideo } from "react-icons/fa6";
import { FaMicrophone } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { timeAgo } from "../../../../utils/functions";
import { GiPin } from "react-icons/gi";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import axios from "axios";
import { baseUrl, messageCountChannel } from "../../../../core";
import { Badge } from "@mui/material";
import io from "socket.io-client"

export const Status = ({ status }: any) => {

    return (
        <>
            <div className="readReciepts">
                {status === "sent" && <DoneIcon className="sent" />}
                {status === "delievered" && <DoneAllIcon className="delievered" />}
                {status === "seen" && <DoneAllIcon className="read" />}
            </div>
        </>
    )

}

export const MessageType = ({ lastMessage, messageType }: any) => {

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

const SingleContact = ({ data, userId, getContacts, contacts }: any) => {

    const navigate = useNavigate();
    const currentUser = useSelector((state: any) => state?.user);
    const [unReadMessages, setUnReadMessages] = useState<number>(0);

    useEffect(() => {
        getUnReadMessages(data?._id);
    }, [contacts]);

    useEffect(() => {

        const socket = io(baseUrl);

        socket.on(`${messageCountChannel}-${data?._id}`, async () => {
            await getContacts();
        });

        return () => {
            socket.disconnect();
        }

    }, [data._id, getContacts]);

    const getUnReadMessages = async (opponentId: string) => {
        if (!opponentId || opponentId?.trim() === "") return;

        try {
            const resp = await axios.get(`${baseUrl}/api/v1/unread-messages/${opponentId}`, { withCredentials: true });
            setUnReadMessages(resp?.data?.data);
        } catch (error) {
            console.error(error);
        }
    };

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
                        <h4>{data?.userName} {data?._id == currentUser?._id ? "(You)" : ""}</h4>
                        <div>
                            {data?.isReceived ? null : <Status status={data?.status} />}
                            <MessageType lastMessage={data?.lastMessage} messageType={data?.messageType} />
                        </div>
                    </div>
                    <span className="messageTime">
                        {data?.time ? <p style={{marginRight: data?._id?.toString() === currentUser?._id?.toString() ? '-2em' : '0em'}}>{timeAgo(data?.time)}</p> : null}
                        {data?._id == currentUser?._id ? <GiPin style={{ fontSize: "1.2em", marginLeft: "0.5em" }} /> : null}
                        {(unReadMessages && data?._id?.toString() !== currentUser?._id?.toString()) ? <Badge badgeContent={unReadMessages} color="primary" /> : null}
                    </span>
                </div>
            </div>
        </>
    )
}

export default SingleContact