import "./Main.css"
import { useNavigate } from "react-router-dom"
import fallBackProfileImage from "/default_avatar.png"
import { AntdImage as Image } from "../../../../../components/antd/Image"

const ContactSearchContact = ({ data }: any) => {

    const navigate = useNavigate()

    return (
        <>
            <div className="chatSearchContact" onClick={() => navigate(`/chat/${data?._id}`)}>
                <Image src={data?.profilePhoto} alt="user image"
                    onError={(e: any) => {
                        e.target.src = fallBackProfileImage
                        e.target.style.padding = "0.4em"
                    }}
                />
                <h4>{data?.userName}</h4>
            </div>
        </>
    )
}

export default ContactSearchContact