import "./main.css"
import fallBackProfileImage from "/default_avatar.png"

const SingleContact = ({ data }: any) => {
    return (
        <>
            <div className="singleContact">
                <div>
                    <img src={data?.profilePhoto} alt="profile-photo"
                        onError={(e: any) => {
                            e.target.src = fallBackProfileImage
                            e.target.style.padding = "0.4em"
                        }}
                    />
                </div>
            </div>
        </>
    )
}

export default SingleContact