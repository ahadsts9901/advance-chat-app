import { useEffect, useState } from "react"
import "./Main.css"
import axios from "axios"
import { baseUrl } from "../../../core"
import { IoIosArrowForward } from "react-icons/io";
import { IconButton } from "@mui/material";
import { useNavigate } from "react-router-dom";

export const MediaDetails = ({ mediaCount, user }: any) => {

  const navigate = useNavigate()

  return (
    <>
      <div className="mediaCount">
        <p>Images, videos and audios</p>
        <div>
          <p>{mediaCount}</p>
          <IconButton size="small" onClick={() => navigate(`/chat/${user?._id}`)}><IoIosArrowForward /></IconButton>
        </div>
      </div>
    </>
  )

}

export const Media = ({ media }: any) => {
  return (
    <>
      <div className="media-sect">media-sect</div>
    </>
  )
}

const MediaSection = ({ user }: any) => {

  const [media, setMedia] = useState<any[]>([])

  useEffect(() => {
    getMedia()
  }, [])

  const getMedia = async () => {

    if (!user || !user?._id || user?._id?.trim() === "") return

    try {

      const resp = await axios.get(`${baseUrl}/api/v1/media/${user?._id}`, { withCredentials: true })
      setMedia(resp?.data?.data)

    } catch (error) {
      console.error(error)
    }

  }

  return (
    <>
      <div className="mediaSection">
        <MediaDetails mediaCount={media?.length} user={user} />
        <Media media={media} />
      </div>
    </>
  )
}

export default MediaSection