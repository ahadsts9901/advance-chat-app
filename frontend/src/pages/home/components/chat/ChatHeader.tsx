import { useDispatch, useSelector } from "react-redux"
import "./main.css"
import { IconButton } from "@mui/material"
import { MdChat } from "react-icons/md";
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useState } from "react";
import axios from "axios";
import { baseUrl } from "../../../../core";
import { useNavigate } from "react-router-dom";
import { logout } from "../../../../redux/user";
import ConfirmAlertMUI from "../../../../components/mui/ConfirmAlert";

const DropLogout = () => {

    const navigate = useNavigate()
    const dispatch = useDispatch()

    const [alertData, setAlertdata] = useState<any>(null)
    const [isAlertOpen, setIsAlertOpen] = useState<boolean>(false)
    const [isLoading, setIsLoading] = useState<boolean>(false)

    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    const logoutConfirmation = () => {

        setIsAlertOpen(true)
        setAlertdata({
            title: "Logout?",
            description: "Are you sure you want to logout?. The action cannot be undone",
            fun: _logout,
        })
        handleClose()

    }

    const _logout = async () => {

        try {

            setIsLoading(true)

            await axios.post(`${baseUrl}/api/v1/logout`, {}, {
                withCredentials: true
            })

            setIsLoading(false)
            dispatch(logout())
            setAlertdata(null)
            setIsAlertOpen(false)
            navigate("/login")

        } catch (error: any) {
            console.error(error)
            setIsLoading(false)
        }

    }

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event?.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const options = [
        { label: "Logout", fun: logoutConfirmation }
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
                    <MenuItem key={i} onClick={option?.fun} sx={{ fontSize: "0.8em" }}>
                        {option?.label}
                    </MenuItem>
                ))}
            </Menu>
        </>
    );

}

const ChatHeader = () => {

    const currentUser = useSelector((state: any) => state?.user)

    return (
        <div className="chatHeader">
            <img src={currentUser?.profilePhoto} alt="profile picture" />
            <div className="iconsCont">
                <IconButton><MdChat /></IconButton>
                <DropLogout />
            </div>
        </div>
    )
}

export default ChatHeader