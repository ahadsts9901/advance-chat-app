import "./Main.css"
import DraggableBox from "../../../../../components/mui/DraggableBox"
import fallBackProfileImage from "/default_avatar.png"
import { Button } from '@mui/material';
import { MdCallEnd, MdLocalPhone } from "react-icons/md";
import axios from "axios";
import { baseUrl, startVideoCallChannel, zegoCloudAppId, zegoCloudSecretKey } from "../../../../../core";
import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setVideoCallData } from "../../../../../redux/user";
import { useParams } from "react-router-dom";
import io from "socket.io-client";
import { ZegoUIKitPrebuilt } from '@zegocloud/zego-uikit-prebuilt'
import { playRingtone, stopRingtone } from "../../../../../utils/functions";

const VideoCall = ({ setOpen, set_is_accepted_call, set_is_lobby_call, is_accepted_call, is_lobby_call }: any) => {

    const dispatch = useDispatch()
    const currentUser = useSelector((state: any) => state?.user)
    const { videoCallData } = currentUser

    const { userId } = useParams()
    const videoCallContainerRef = useRef<HTMLDivElement>(null)

    const [status, setStatus] = useState("...")
    const [user, setUser] = useState<any>(null)
    const [video_call_data_params, seth_video_call_data_params] = useState<any>(null)
    const [isJoinedRoom, setIsJoinedRoom] = useState(false)
    const [isRoomCreated, setIsRoomCreated] = useState(false)
    const [isLobby, setIsLobby] = useState(false)

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

    useEffect(() => {
        const socket = io(baseUrl);

        const listenSocketChannel = () => {
            socket.on('connect', () => console.log("socket connected"))
            socket.on('disconnect', (message) => console.log("socket disconnected: ", message))
            socket.on(startVideoCallChannel, async (e: any) => seth_video_call_data_params(e))
        }
        listenSocketChannel()

        return () => {
            socket.off(startVideoCallChannel)
            socket.disconnect();
        }
    }, [])

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
            await axios.post(`${baseUrl}/api/v1/decline-video-call/${userId}`, {
                isRoomCreated, isLobby, is_accepted_call, is_lobby_call
            }, {
                withCredentials: true
            })
            setIsJoinedRoom(false)
            dispatch(setVideoCallData(null))
            setOpen(false)
            setUser(null)
            setStatus("")
            stopRingtone()
            if (isRoomCreated || isLobby || is_lobby_call || is_accepted_call) {
                window.location.reload()
            }
        } catch (error) {
            console.error(error)
        }
    }

    const acceptVideoCall = async () => {
        try {
            const resp = await axios.post(`${baseUrl}/api/v1/accept-video-call`, {
                videoCallData: videoCallData
            }, { withCredentials: true })
            seth_video_call_data_params(resp?.data?.data)
            set_is_accepted_call(true)
            setIsLobby(true)
            set_is_lobby_call(true)
            stopRingtone()
        } catch (error) {
            console.error(error)
        }
    }

    const myMeeting = async () => {
        try {
            await requestMediaPermissions()

            const appID = zegoCloudAppId;
            const serverSecret = zegoCloudSecretKey;
            const kitToken = ZegoUIKitPrebuilt?.generateKitTokenForTest(
                appID,
                serverSecret,
                video_call_data_params?.room_id,
                `${video_call_data_params?.id_1}`,
                `${video_call_data_params?.id_2}`,
            )
            const zc = ZegoUIKitPrebuilt.create(kitToken)
            setIsRoomCreated(true)
            zc.joinRoom({
                container: videoCallContainerRef?.current,
                scenario: { mode: ZegoUIKitPrebuilt.OneONoneCall },
                showScreenSharingButton: false,
                onLeaveRoom: () => endVideoCall(),
                onJoinRoom: () => setIsJoinedRoom(true),
            })
            zc.autoLeaveRoomWhenOnlySelfInRoom = true
        } catch (error) {
            console.error(error)
            window.location.reload()
        }
    }

    const requestMediaPermissions = async () => {
        try {
            await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        if (video_call_data_params) myMeeting()
        const _button: any = document.querySelector('.VsTVUAD89KWleD0YRVsD')
        if (_button) _button.innerText = "Start Video Call"
        if (!video_call_data_params && status === "Incoming Video Call") playRingtone()
    }, [video_call_data_params, status])

    return (
        <>
            {
                videoCallData && currentUser && user &&
                <>
                    <DraggableBox>
                        <div className="callComponent">
                            <h2>{user?.userName}</h2>
                            {
                                video_call_data_params ? <div ref={videoCallContainerRef} /> :
                                    <>
                                        <p>Video Call</p>
                                        <p>{status ? status : "..."}</p>
                                        <img src={user?.profilePhoto} alt="profile-photo" onError={(e: any) => {
                                            e.target.src = fallBackProfileImage
                                            e.target.style.padding = "0.4em"
                                        }} />
                                    </>
                            }
                            <div className="call-buttons-sts">
                                {
                                    !isJoinedRoom ? <Button color='error' variant='contained' onClick={endVideoCall}><MdCallEnd /></Button> : null
                                }
                                {
                                    (status === "Incoming Video Call" && !video_call_data_params) ? <Button color='success' variant='contained' onClick={acceptVideoCall}><MdLocalPhone /></Button> : null
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