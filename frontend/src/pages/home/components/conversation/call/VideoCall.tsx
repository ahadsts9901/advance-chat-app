import "./Main.css"
import DraggableBox from "../../../../../components/mui/DraggableBox"
import fallBackProfileImage from "/default_avatar.png"
import { Button } from '@mui/material';
import { MdCallEnd } from "react-icons/md";
import axios from "axios";
import { baseUrl } from "../../../../../core";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setVideoCallData } from "../../../../../redux/user";
import { useParams } from "react-router-dom";

const VideoCall = ({ setOpen }: any) => {

    const dispatch = useDispatch()
    const currentUser = useSelector((state: any) => state?.user)
    const { videoCallData } = currentUser

    const { userId } = useParams()

    const [status, setStatus] = useState("")
    const [user, setUser] = useState<any>(null)

    const currentUserId = currentUser?._id?.toString();
    const opponentUserId = videoCallData?.opponentUser?._id?.toString();
    const isCurrentUser = currentUserId === videoCallData?.currentUser?._id?.toString();

    useEffect(() => {
        requestVideoCall()
    }, [])

    useEffect(() => {
        if (!videoCallData) return;

        switch (true) {
            case isCurrentUser:
                setStatus(videoCallData?.opponentUser?.isActive ? "Ringing" : "Calling");
                break;
            case opponentUserId === currentUserId:
                setStatus("Incoming Video Call")
                break;
            default:
                setStatus("");
                break;
        }
    }, [videoCallData, currentUser])

    useEffect(() => {

        if (isCurrentUser) {
            setUser(videoCallData?.opponentUser)
        } else if (opponentUserId === currentUserId) {
            setUser(videoCallData?.currentUser)
        }

    }, [videoCallData, currentUser])

    const requestVideoCall = async () => {
        try {
            const resp = await axios.post(`${baseUrl}/api/v1/request-video-call/${userId}`, {}, {
                withCredentials: true
            })
            dispatch(setVideoCallData(resp?.data?.data))
        } catch (error) {
            console.error(error)
        }
    }

    const endVideoCall = async () => {
        try {
            await axios.post(`${baseUrl}/api/v1/decline-video-call/${userId}`, {}, {
                withCredentials: true
            })
            dispatch(setVideoCallData(null))
            setOpen(false)
            setUser(null)
            setStatus("")
        } catch (error) {
            console.error(error)
        }
    }

    return (
        <>
            {
                videoCallData && currentUser && user &&
                <>
                    <DraggableBox>
                        <div className="callComponent">
                            <h2>{user?.userName}</h2>
                            <p>Video Call</p>
                            <p>{status}</p>
                            <img src={user?.profilePhoto} alt="profile-photo" onError={(e: any) => {
                                e.target.src = fallBackProfileImage
                                e.target.style.padding = "0.4em"
                            }} />
                            <Button color='error' variant='contained' onClick={endVideoCall}><MdCallEnd /></Button>
                        </div>
                    </DraggableBox>
                </>
            }
        </>
    )
}

export default VideoCall