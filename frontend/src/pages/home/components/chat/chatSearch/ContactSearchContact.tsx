import "./Main.css"
import { useNavigate } from "react-router-dom"
import fallBackProfileImage from "/default_avatar.png"

const ContactSearchContact = ({ data }: any) => {

    const navigate = useNavigate()

    return (
        <>
            <div className="chatSearchContact" onClick={() => navigate(`/chat/${data?._id}`)}>
                <img src={data?.profilePhoto} alt="user image"
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