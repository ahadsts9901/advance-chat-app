import "./App.css"

import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { login, logout } from "./redux/user";
import axios from "axios";
import { baseUrl } from "./core";
import SplashScreen from "./pages/splashScreen/SplashScreen";
import Login from "./pages/login/Login";
import { Navigate, Route, Routes } from "react-router-dom";

const UnAuthRouting = () => {

    return (
        <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="*" element={<Navigate to="/login" replace={true} />} />
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

    return (
        <>

            {
                currentUser?.isLogin == null ? <SplashScreen /> : null
            }

            {
                currentUser?.isLogin == false ? <UnAuthRouting /> : null
            }

        </>
    )
}

export default Routing