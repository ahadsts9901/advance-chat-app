import "./Main.css"
import DraggableBox from "../../../../../components/mui/DraggableBox"
import fallBackProfileImage from "/default_avatar.png"
import { Button } from '@mui/material';
import { MdCallEnd } from "react-icons/md";

const VoiceCall = ({ setOpen, user }: any) => {

    const handleEndCall = () => {
        setOpen(false)
    }

    return (
        <>
            <DraggableBox>
                <div className="callComponent">
                    <h2>{user?.userName}</h2>
                    <p>Voice Call</p>
                    <p>calling/ringing</p>
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

export default VoiceCall