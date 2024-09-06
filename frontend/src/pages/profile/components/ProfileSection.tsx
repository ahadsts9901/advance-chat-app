import "./Main.css";
import DataSection from "./DataSection";
import MediaSection from "./MediaSection";
import { IoMdShare } from "react-icons/io";
import { MdChat } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { useRef, useState } from "react";
import { MdOutlineDownloadDone } from "react-icons/md";
import { Button } from "@mui/material";
import axios from "axios";
import { baseUrl } from "../../../core";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../../../redux/user";

const OptProfile = ({ data }: any) => {
    return (
        <div className="profile-option" onClick={data?.fun}>
            {data?.icon}
            <p>{data?.label}</p>
        </div>
    );
};

const ProfileSection = ({ user, setUser, setContacts }: any) => {

    const navigate = useNavigate();
    const dispatch = useDispatch()
    const currentUser = useSelector((state: any) => state?.user)

    const fileRef: any = useRef()

    const [copyLabel, setCopyLabel] = useState("Share Profile");
    const [copyIcon, setCopyIcon] = useState(<IoMdShare />)
    const [base64Url, setBase64Url] = useState<null | string>(null)
    const [isLoading, setIsLoading] = useState<boolean>(false)

    const chatFunction = () => navigate(`/chat/${user?._id}`);

    const copyFun = () => {
        navigator.clipboard.writeText(`${window?.location?.host}/profile/${user?._id}`);
        setCopyLabel("Link Copied!");
        setCopyIcon(<MdOutlineDownloadDone />)
        setTimeout(() => {
            setCopyLabel("Share Profile")
            setCopyIcon(<IoMdShare />)
        }, 1000);
    };

    const options = [
        { label: copyLabel, path: "profile", icon: copyIcon, fun: copyFun },
        { label: "Chat", path: "chat", icon: <MdChat />, fun: chatFunction },
    ];

    const updateProfilePhoto = async () => {

        if (!fileRef) return
        if (!fileRef?.current) return
        if (!fileRef?.current?.files) return
        if (!fileRef?.current?.files?.length) return
        if (!fileRef?.current?.files[0]) return

        try {

            setIsLoading(true)
            const formData = new FormData()
            formData.append('file', fileRef?.current?.files[0])

            const resp = await axios.put(`${baseUrl}/api/v1/profile-picture`, formData, {
                withCredentials: true,
                headers: { "Content-Type": "multipart/form-data" },
            })

            dispatch(login({ ...currentUser, profilePhoto: resp?.data?.data }))
            setUser({ ...user, profilePhoto: resp?.data?.data })
            setBase64Url(null)
            setIsLoading(false)
            setContacts((contacts: any) => contacts?.map((contact: any) =>
                contact?._id?.toString() === currentUser?._id?.toString() ? { ...contact, profilePhoto: resp?.data?.data } : contact
            ))
            if (fileRef?.current) fileRef.current.value = ''

        } catch (error) {
            console.error(error)
            setIsLoading(false)
        }

    }

    return (
        <div className="profileSection">
            <input type="file" ref={fileRef} hidden accept="image/*" onChange={(e: any) => setBase64Url(URL.createObjectURL(e?.target?.files[0]))} />
            <DataSection user={user} setUser={setUser} fileRef={fileRef} base64Url={base64Url} setBase64Url={setBase64Url} setContacts={setContacts} />
            <MediaSection user={user} />
            {options?.map((option: any, i: number) => (
                <OptProfile key={i} data={option} />
            ))}
            {
                base64Url?.length ?
                    <>
                        <Button
                            onClick={updateProfilePhoto}
                            variant="outlined" color="primary"
                            sx={{ marginX: "auto", paddingX: "6em", marginTop: "2em" }}
                            disabled={isLoading}
                        >Save Changes</Button>
                    </>
                    : null
            }
        </div>
    );
};

export default ProfileSection;