import "./Main.css"
import DraggableBox from "../../../../../components/mui/DraggableBox"
import fallBackProfileImage from "/default_avatar.png"
import { Button } from '@mui/material';
import { MdCallEnd, MdLocalPhone } from "react-icons/md";
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

    const [status, setStatus] = useState("...")
    const [user, setUser] = useState<any>(null)

    const currentUserId = currentUser?._id?.toString();
    const opponentUserId = videoCallData?.opponentUser?._id?.toString();
    const isCurrentUser = currentUserId === videoCallData?.currentUser?._id?.toString();

    useEffect(() => {
        requestVideoCall()
    }, [])

    useEffect(() => {
        if (!videoCallData || !currentUser) return;

        let finalStatus = '';

        switch (true) {
            case isCurrentUser:
                finalStatus = "Incoming Video Call";
                break;
            case opponentUserId === currentUserId:
                finalStatus = videoCallData?.opponentUser?.isActive ? "Ringing" : "Calling";
                break;
            default:
                finalStatus = "...";
                break;
        }

        const timer = setTimeout(() => {
            setStatus(finalStatus);
        }, 2000);

        return () => clearTimeout(timer);
    }, [videoCallData, currentUser, isCurrentUser, opponentUserId, currentUserId]);

    useEffect(() => {

        if (isCurrentUser) {
            setUser(videoCallData?.opponentUser)
        } else if (opponentUserId === currentUserId) {
            setUser(videoCallData?.currentUser)
        }

    }, [videoCallData, currentUser])

    const requestVideoCall = async () => {
        try {
            setStatus("")
            const resp = await axios.post(`${baseUrl}/api/v1/request-video-call/${userId}`, {}, {
                withCredentials: true
            })
            dispatch(setVideoCallData(resp?.data?.data))
        } catch (error) {
            console.error(error)
            setStatus("")
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

    const acceptVideoCall = async () => {
        try {

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
                            <p>{status ? status : "..."}</p>
                            <img src={user?.profilePhoto} alt="profile-photo" onError={(e: any) => {
                                e.target.src = fallBackProfileImage
                                e.target.style.padding = "0.4em"
                            }} />
                            <div className="call-buttons-sts">
                                <Button color='error' variant='contained' onClick={endVideoCall}><MdCallEnd /></Button>
                                {
                                    status === "Incoming Video Call" ? <Button color='success' variant='contained' onClick={acceptVideoCall}><MdLocalPhone /></Button> : null
                                }
                            </div>
                        </div>
                    </DraggableBox>
                </>
            }
        </>
    )
}

export default VideoCall