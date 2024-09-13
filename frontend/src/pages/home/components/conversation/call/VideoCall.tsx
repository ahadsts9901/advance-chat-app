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

const VideoCall = ({ setOpen, user }: any) => {

    const dispatch = useDispatch()
    const currentUser = useSelector((state: any) => state?.user)
    const { videoCallData } = currentUser

    const [status, setStatus] = useState("")

    const handleEndCall = () => {
        setOpen(false)
    }

    useEffect(() => {
        requestVideoCall()
    }, [])

    const requestVideoCall = async () => {
        try {
            const resp = await axios.post(`${baseUrl}/api/v1/request-video-call/${user?._id}`, {}, {
                withCredentials: true
            })
            dispatch(setVideoCallData(resp?.data?.data))
        } catch (error) {
            console.error(error)
        }
    }

    useEffect(() => {
        if (!videoCallData) return;

        const currentUserId = currentUser?._id?.toString();
        const opponentUserId = videoCallData?.opponentUser?._id?.toString();
        const isCurrentUser = currentUserId === videoCallData?.currentUser?._id?.toString();

        if (opponentUserId === currentUserId) {
            setStatus(videoCallData?.currentUser?.isActive ? "Ringing" : "Calling");
        } else if (isCurrentUser) {
            setStatus("Incoming Video Call");
        } else {
            setStatus("");
        }
    }, [videoCallData, currentUser]);

    console.log("videoCallData", status, videoCallData)

    return (
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
                    <Button color='error' variant='contained' onClick={handleEndCall}><MdCallEnd /></Button>
                </div>
            </DraggableBox>
        </>
    )
}

export default VideoCall