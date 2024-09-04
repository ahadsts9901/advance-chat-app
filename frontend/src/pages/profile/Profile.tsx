import "./Main.css"
import { useParams } from "react-router-dom"
import { useEffect, useState } from "react"
import axios from "axios"
import { baseUrl } from "../../core"

const Profile = () => {

    const { userId } = useParams()

    const [user, setUser] = useState<any>(null)
    const [isLoading, setIsLoading] = useState<boolean>(false)

    useEffect(() => {

        getProfile()

    }, [userId])

    const getProfile = async () => {

        if (!userId || userId?.trim() === "") return

        try {

            setIsLoading(true)

            const resp = await axios.get(`${baseUrl}/api/v1/profile/${userId}`, { withCredentials: true })

            setIsLoading(false)
            setUser(resp?.data?.data)

        } catch (error) {
            console.error(error)
            setIsLoading(false)
        }

    }

    return (
        <>
            <div>
                Profile : {userId}
                <br />
                {isLoading ? "loading..." : JSON.stringify(user)}
            </div>
        </>
    )
}

export default Profile
