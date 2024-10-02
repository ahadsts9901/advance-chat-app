import "./App.css"

import '@fontsource/josefin-sans/300.css';
import '@fontsource/josefin-sans/400.css';
import '@fontsource/josefin-sans/500.css';
import '@fontsource/josefin-sans/700.css';

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { login, logout, setIsVideoCallOpen, setIsVoiceCallOpen, setVideoCallData, setVoiceCallData } from "./redux/user";
import axios from "axios";
import { baseUrl, endVideoCallChannel, endVoiceCallChannel, requestVideoCallChannel } from "./core";
import SplashScreen from "./pages/splashScreen/SplashScreen";
import Login from "./pages/login/Login";
import { Navigate, Route, Routes } from "react-router-dom";
import Home from "./pages/home/Home";
import Profile from "./pages/profile/Profile";
import io from "socket.io-client"

const UnAuthRouting = () => {

    return (
        <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="*" element={<Navigate to="/login" replace={true} />} />
        </Routes>
    )

}

const AuthRouting = () => {

    const dispatch = useDispatch()
    const currentUser = useSelector((state: any) => state?.user)

    const [is_accepted_call, set_is_accepted_call] = useState(false)
    const [is_lobby_call, set_is_lobby_call] = useState(false)

    useEffect(() => {
        const socket = io(baseUrl);
        socket.on(`${requestVideoCallChannel}-${currentUser?._id}`, (e: any) => {
            dispatch(setIsVideoCallOpen(true))
            dispatch(setVideoCallData(e))
        })
        socket.on(`${endVideoCallChannel}-${currentUser?._id}`, (e: any) => {
            dispatch(setIsVideoCallOpen(false))
            dispatch(setVideoCallData(null))
            if (is_accepted_call || is_lobby_call || e?.isLobby || e?.isRoomCreated) {
                window.location.reload()
            }
        })
        socket.on(`${endVoiceCallChannel}-${currentUser?._id}`, (e: any) => {
            dispatch(setIsVoiceCallOpen(false))
            dispatch(setVoiceCallData(null))
            if (is_accepted_call || is_lobby_call || e?.isLobby || e?.isRoomCreated) {
                window.location.reload()
            }
        })
        return () => { socket.close() }
    }, [currentUser])

    return (
        <>
            <Routes>
                <Route path="/" element={<Home is_accepted_call={is_accepted_call} set_is_accepted_call={set_is_accepted_call} is_lobby_call={is_lobby_call} set_is_lobby_call={set_is_lobby_call} />} />
                <Route path="/chat/:userId" element={<Home is_accepted_call={is_accepted_call} set_is_accepted_call={set_is_accepted_call} is_lobby_call={is_lobby_call} set_is_lobby_call={set_is_lobby_call} />} />
                <Route path="/profile/:userId" element={<Profile />} />
                <Route path="*" element={<Navigate to="/" replace={true} />} />
            </Routes>
        </>
    )

}

const Routing = () => {

    const dispatch = useDispatch()
    const currentUser = useSelector((state: any) => state?.user)

    useEffect(() => {
        checkLoginStatus()
    }, [])

    const checkLoginStatus = async () => {

        try {

            const resp = await axios.get(`${baseUrl}/api/v1/profile`, { withCredentials: true })

            if (currentUser?.isActive) {
                await axios.put(`${baseUrl}/api/v1/mark-messages-delievered`, {}, {
                    withCredentials: true
                })
            }

            dispatch(login(resp?.data?.data))

        } catch (error) {
            console.error(error)
            dispatch(logout())
        }

    }

    const handleBeforeUnload = async (event: BeforeUnloadEvent) => {

        event.preventDefault()

        try {

            const message = "Are you sure you want to leave? Changes you made may not be saved."
            await axios.put(`${baseUrl}/api/v1/user-offline`, {}, { withCredentials: true })
            return message;

        } catch (error) {
            console.error(error)
        }

    };

    useEffect(() => {

        window.addEventListener('beforeunload', handleBeforeUnload);

        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };

    }, []);

    return (
        <>

            {
                currentUser?.isLogin == null ? <SplashScreen /> : null
            }

            {
                currentUser?.isLogin == false ? <UnAuthRouting /> : null
            }

            {
                currentUser?.isLogin == true ? <AuthRouting /> : null
            }

        </>
    )
}

export default Routing