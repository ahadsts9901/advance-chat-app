import "./main.css"
import { IconButton } from "@mui/material"
import fallBackProfileImage from "/default_avatar.png"
import { MdLocalPhone } from "react-icons/md";
import { IoIosVideocam } from "react-icons/io";
import { IoSearch } from "react-icons/io5";

const ConversationHeader = ({ user }: any) => {

    return (
        <>
            <div className="conversationHeader">
                <>
                    <div className="userData">
                        <img src={user?.profilePhoto} alt="profilePhoto" onError={(e: any) => {
                            e.target.src = fallBackProfileImage
                            e.target.style.padding = "0.4em"
                        }} />
                        <div>
                            <h4>{user?.userName}</h4>
                            <p>{user?.isActive ? "Online" : "Offline"}</p>
                        </div>
                    </div>
                </>
                <>
                    <div className="icons">
                        <IconButton><MdLocalPhone /></IconButton>
                        <IconButton><IoIosVideocam /></IconButton>
                        <IconButton><IoSearch /></IconButton>
                    </div>
                </>
            </div>
        </>
    )

}

export default ConversationHeader