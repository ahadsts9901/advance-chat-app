import "./main.css"
import fallBackProfileImage from "/default_avatar.png"

const ConversationHeader = ({ user }: any) => {

    return (
        <>
            <div className="conversationHeader">
                <div className="userData">
                    <img src={user?.profilePhoto} alt="profilePhoto" onError={(e: any) => {
                        e.target.src = fallBackProfileImage
                        e.target.style.padding = "0.4em"
                    }} />
                </div>
            </div>
        </>
    )

}

export default ConversationHeader