import "./main.css"
import { Button } from "@mui/material"
import { FcGoogle } from "react-icons/fc";

const GoogleLoginButton = () => {
    return (
        <>
            <Button color="primary" variant="contained">
                <FcGoogle className="googleIconLogin" />
                Continue With Google
            </Button>
        </>
    )
}

export default GoogleLoginButton