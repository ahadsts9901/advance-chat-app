import "./main.css"
import "../utils/firebase"
import { Button } from "@mui/material"
import { useEffect, useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import AlertMui from "./mui/AlertMui";
import axios from "axios";
import { baseUrl } from "../core";

const GoogleLoginButton = () => {

    const googleProvider = new GoogleAuthProvider();
    const auth = getAuth();

    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [errorMessage, setErrorMessage] = useState<string | null>(null)

    const [googleToken, setGoogleToken] = useState<null | string>(null)

    useEffect(() => {
        if (googleToken) googleLogin(googleToken)
    }, [googleToken])

    const getAccessToken = async () => {

        setIsLoading(true)

        await signInWithPopup(auth, googleProvider)
            .then((result) => {
                const credential: any = GoogleAuthProvider.credentialFromResult(result);
                const token = credential.accessToken;
                setGoogleToken(token)
                setIsLoading(false)
            }).catch((error) => {
                console.error(error);
                setIsLoading(false)
            });

    }

    const googleLogin = async (token: string) => {

        if (!token) return

        try {

            const resp = await axios.post(`${baseUrl}/api/v1/google-login`, {
                accessToken: `Bearer ${token}`
            }, { withCredentials: true })

            console.log(resp?.data)

        } catch (error) {
            console.error(error)
            setErrorMessage("Error in signing in")
            setTimeout(() => {
                setErrorMessage(null)
            }, 3000);
        }

    }

    return (
        <>
            {errorMessage && <AlertMui status="error" text={errorMessage} />}
            <Button color="primary" variant="contained" onClick={getAccessToken} disabled={isLoading}>
                <FcGoogle className="googleIconLogin" />
                Continue With Google
            </Button>
        </>
    )
}

export default GoogleLoginButton