import DataSection from "./DataSection"
import "./Main.css"
import MediaSection from "./MediaSection"

const ProfileSection = ({ user }: any) => {
    return (
        <>
            <div className="profileSection">
                <DataSection  user={user}/>
                <MediaSection />
            </div>
        </>
    )
}

export default ProfileSection