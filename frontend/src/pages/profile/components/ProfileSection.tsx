import "./Main.css";
import DataSection from "./DataSection";
import MediaSection from "./MediaSection";
import { IoMdShare } from "react-icons/io";
import { MdChat } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { MdOutlineDownloadDone } from "react-icons/md";

const OptProfile = ({ data }: any) => {
    return (
        <div className="profile-option" onClick={data?.fun}>
            {data?.icon}
            <p>{data?.label}</p>
        </div>
    );
};

const ProfileSection = ({ user }: any) => {

    const navigate = useNavigate();

    const [copyLabel, setCopyLabel] = useState("Share Profile");
    const [copyIcon, setCopyIcon] = useState(<IoMdShare />)

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

    return (
        <div className="profileSection">
            <DataSection user={user} />
            <MediaSection user={user} />
            {options?.map((option: any, i: number) => (
                <OptProfile key={i} data={option} />
            ))}
        </div>
    );
};

export default ProfileSection;