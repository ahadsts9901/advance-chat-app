import DataSection from "./DataSection"
import "./Main.css"
import MediaSection from "./MediaSection"

const ProfileSection = ({ user }: any) => {
    return (
        <>
            <div className="profileSection">
                <DataSection user={user} />
                <MediaSection user={user} />
            </div>
        </>
    )
}

export default ProfileSection