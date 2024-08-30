import "./App.css"

import '@fontsource/josefin-sans/300.css';
import '@fontsource/josefin-sans/400.css';
import '@fontsource/josefin-sans/500.css';
import '@fontsource/josefin-sans/700.css';

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { login, logout } from "./redux/user";
import axios from "axios";
import { baseUrl } from "./core";
import SplashScreen from "./pages/splashScreen/SplashScreen";
import Login from "./pages/login/Login";
import { Navigate, Route, Routes } from "react-router-dom";
import Home from "./pages/home/Home";

const UnAuthRouting = () => {

    return (
        <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="*" element={<Navigate to="/login" replace={true} />} />
        </Routes>
    )

}

const AuthRouting = () => {

    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/chat/:userId" element={<Home />} />
            <Route path="*" element={<Navigate to="/" replace={true} />} />
        </Routes>
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
            const resp = await axios.put(`${baseUrl}/api/v1/user-offline`, {}, { withCredentials: true })
            console.log(resp)
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