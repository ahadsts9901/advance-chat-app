import "./Main.css"
import DraggableBox from "../../../../../components/mui/DraggableBox"
import fallBackProfileImage from "/default_avatar.png"
import { Button } from '@mui/material';
import { MdCallEnd, MdLocalPhone } from "react-icons/md";
import axios from "axios";
import { baseUrl, startVoiceCallChannel, zegoCloudAppId, zegoCloudSecretKey } from "../../../../../core";
import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setVoiceCallData } from "../../../../../redux/user";
import { useParams } from "react-router-dom";
import io from "socket.io-client";
import { ZegoUIKitPrebuilt } from '@zegocloud/zego-uikit-prebuilt'

const VoiceCall = ({ setOpen, set_is_accepted_call, set_is_lobby_call, is_accepted_call, is_lobby_call }: any) => {

    const dispatch = useDispatch()
    const currentUser = useSelector((state: any) => state?.user)
    const { voiceCallData } = currentUser

    const { userId } = useParams()
    const voiceCallContainerRef = useRef<HTMLDivElement>(null)

    const [status, setStatus] = useState("...")
    const [user, setUser] = useState<any>(null)
    const [voice_call_data_params, seth_voice_call_data_params] = useState<any>(null)
    const [isJoinedRoom, setIsJoinedRoom] = useState(false)
    const [isRoomCreated, setIsRoomCreated] = useState(false)
    const [isLobby, setIsLobby] = useState(false)

    const currentUserId = currentUser?._id?.toString();
    const opponentUserId = voiceCallData?.opponentUser?._id?.toString();
    const isCurrentUser = currentUserId === voiceCallData?.currentUser?._id?.toString();

    useEffect(() => {
        requestVoiceCall()
    }, [])

    useEffect(() => {
        if (!voiceCallData || !currentUser) return;

        let finalStatus = '';

        switch (true) {
            case isCurrentUser:
                finalStatus = "Incoming Voice Call";
                break;
            case opponentUserId === currentUserId:
                finalStatus = voiceCallData?.opponentUser?.isActive ? "Ringing" : "Calling";
                break;
            default:
                finalStatus = "...";
                break;
        }

        const timer = setTimeout(() => {
            setStatus(finalStatus);
        }, 2000);

        return () => clearTimeout(timer);
    }, [voiceCallData, currentUser, isCurrentUser, opponentUserId, currentUserId]);

    useEffect(() => {

        if (isCurrentUser) {
            setUser(voiceCallData?.opponentUser)
        } else if (opponentUserId === currentUserId) {
            setUser(voiceCallData?.currentUser)
        }

    }, [voiceCallData, currentUser])

    useEffect(() => {
        const socket = io(baseUrl);

        const listenSocketChannel = () => {
            socket.on('connect', () => console.log("socket connected"))
            socket.on('disconnect', (message) => console.log("socket disconnected: ", message))
            socket.on(startVoiceCallChannel, async (e: any) => seth_voice_call_data_params(e))
        }
        listenSocketChannel()

        return () => {
            socket.off(startVoiceCallChannel)
            socket.disconnect();
        }
    }, [])

    const requestVoiceCall = async () => {
        try {
            setStatus("")
            const resp = await axios.post(`${baseUrl}/api/v1/request-voice-call/${userId}`, {}, {
                withCredentials: true
            })
            dispatch(setVoiceCallData(resp?.data?.data))
        } catch (error) {
            console.error(error)
            setStatus("")
        }
    }

    const endVoiceCall = async () => {
        try {
            await axios.post(`${baseUrl}/api/v1/decline-voice-call/${userId}`, {
                isRoomCreated, isLobby, is_accepted_call, is_lobby_call
            }, {
                withCredentials: true
            })
            setIsJoinedRoom(false)
            dispatch(setVoiceCallData(null))
            setOpen(false)
            setUser(null)
            setStatus("")
            if (isRoomCreated || isLobby || is_lobby_call || is_accepted_call) {
                window.location.reload()
            }
        } catch (error) {
            console.error(error)
        }
    }

    const acceptVoiceCall = async () => {
        try {
            const resp = await axios.post(`${baseUrl}/api/v1/accept-voice-call`, {
                voiceCallData: voiceCallData
            }, { withCredentials: true })
            seth_voice_call_data_params(resp?.data?.data)
            set_is_accepted_call(true)
            setIsLobby(true)
            set_is_lobby_call(true)
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
                voice_call_data_params?.room_id,
                `${voice_call_data_params?.id_1}`,
                `${voice_call_data_params?.id_2}`,
            )
            const zc = ZegoUIKitPrebuilt.create(kitToken)
            setIsRoomCreated(true)
            zc.joinRoom({
                container: voiceCallContainerRef?.current,
                scenario: { mode: ZegoUIKitPrebuilt.OneONoneCall },
                showScreenSharingButton: false,
                showAudioVideoSettingsButton: false,
                turnOnCameraWhenJoining: false,
                onLeaveRoom: () => endVoiceCall(),
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
            await navigator.mediaDevices.getUserMedia({ audio: true });
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        if (voice_call_data_params) myMeeting()
        const _button: any = document.querySelector('.VsTVUAD89KWleD0YRVsD')
        if (_button) _button.innerText = "Start Voice Call"
    }, [voice_call_data_params])

    return (
        <>
            {
                voiceCallData && currentUser && user &&
                <>
                    <DraggableBox>
                        <div className="callComponent">
                            <h2>{user?.userName}</h2>
                            {
                                voice_call_data_params ? <div ref={voiceCallContainerRef} /> :
                                    <>
                                        <p>Voice Call</p>
                                        <p>{status ? status : "..."}</p>
                                        <img src={user?.profilePhoto} alt="profile-photo" onError={(e: any) => {
                                            e.target.src = fallBackProfileImage
                                            e.target.style.padding = "0.4em"
                                        }} />
                                    </>
                            }
                            <div className="call-buttons-sts">
                                {
                                    !isJoinedRoom ? <Button color='error' variant='contained' onClick={endVoiceCall}><MdCallEnd /></Button> : null
                                }
                                {
                                    (status === "Incoming Voice Call" && !voice_call_data_params) ? <Button color='success' variant='contained' onClick={acceptVoiceCall}><MdLocalPhone /></Button> : null
                                }
                            </div>
                        </div>
                    </DraggableBox>
                </>
            }
        </>
    )
}

export default VoiceCall