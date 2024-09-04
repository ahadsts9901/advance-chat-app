import { useParams } from "react-router-dom"
import "./Main.css"

const Profile = () => {

    const { userId } = useParams()

    return (
        <>
            <div>
                Profile : {userId}
            </div>
        </>
    )
}

export default Profile
