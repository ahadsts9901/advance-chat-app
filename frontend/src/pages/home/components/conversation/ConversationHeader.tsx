import "./main.css"
import { IconButton, Menu, MenuItem } from "@mui/material"
import fallBackProfileImage from "/default_avatar.png"
import { MdLocalPhone } from "react-icons/md";
import { IoIosVideocam } from "react-icons/io";
import { IoSearch } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import ConfirmAlertMUI from "../../../../components/mui/ConfirmAlert";
import MoreVertIcon from '@mui/icons-material/MoreVert';
import io from "socket.io-client"
import { baseUrl, userActiveChannel } from "../../../../core";
import { useSelector } from "react-redux";

const DropMenu = () => {

    const navigate = useNavigate()

    const [alertData, setAlertdata] = useState<any>(null)
    const [isAlertOpen, setIsAlertOpen] = useState<boolean>(false)
    const [isLoading, setIsLoading] = useState<boolean>(false)

    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event?.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const options = [
        { label: "Clear Chat", fun: () => console.log("clear chat") },
        { label: "Close Chat", fun: () => console.log("close chat") },
        { label: "Delete Chat", fun: () => console.log("delete chat") },
    ]

    return (
        <>
            <ConfirmAlertMUI
                open={isAlertOpen}
                setOpen={setIsAlertOpen}
                title={alertData?.title}
                description={alertData?.description}
                fun={alertData?.fun}
                isLoading={isLoading}
            />
            <IconButton
                aria-label="more"
                id="long-button"
                aria-controls={open ? 'long-menu' : undefined}
                aria-expanded={open ? 'true' : undefined}
                aria-haspopup="true"
                onClick={handleClick}
            >
                <MoreVertIcon />
            </IconButton>
            <Menu
                id="long-menu"
                MenuListProps={{
                    'aria-labelledby': 'long-button',
                }}
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
            >
                {options?.map((option: any, i: number) => (
                    <MenuItem key={i} onClick={option?.fun} sx={{ fontSize: "0.8em", padding: "1em" }}>
                        {option?.label}
                    </MenuItem>
                ))}
            </Menu>
        </>
    );

}

const ConversationHeader = ({ user, setUser }: any) => {

    const currentUser = useSelector((state: any) => state?.user)

    useEffect(() => {
        listenSocketChannel()
    }, [])

    const listenSocketChannel = async () => {

        const socket = io(baseUrl);

        socket.on(`${userActiveChannel}-${user?._id}`, async (e: any) => setUser({ ...user, ...e }))

        return () => socket.close()

    }

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
                            {
                                user?._id == currentUser?._id ? <p>You</p> :
                                    <p>{user?.isActive ? "Online" : "Offline"}</p>
                            }
                        </div>
                    </div>
                </>
                <>
                    <div className="icons">
                        <IconButton><MdLocalPhone /></IconButton>
                        <IconButton><IoIosVideocam /></IconButton>
                        <IconButton><IoSearch /></IconButton>
                        <DropMenu />
                    </div>
                </>
            </div>
        </>
    )

}

export default ConversationHeader