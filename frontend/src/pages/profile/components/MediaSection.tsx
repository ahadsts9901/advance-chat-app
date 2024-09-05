import { useEffect, useState } from "react"
import "./Main.css"
import axios from "axios"
import { baseUrl } from "../../../core"
import { IoIosArrowForward } from "react-icons/io";
import { IconButton } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { FaMicrophone } from "react-icons/fa";
import { FaVideo } from "react-icons/fa";

export const MediaDetails = ({ mediaCount, user }: any) => {

  const navigate = useNavigate()

  return (
    <>
      <div className="mediaCount">
        <p>Images, videos and audios</p>
        <div>
          <p>{mediaCount ? mediaCount : ""}</p>
          <IconButton size="small" onClick={() => navigate(`/chat/${user?._id}`)}><IoIosArrowForward /></IconButton>
        </div>
      </div>
    </>
  )

}

export const Media = ({ media }: any) => {
  return (
    <>
      <div className="media-sect">
        {
          media?.map((media: any, i: number) => <MediaBox key={i} media={media} />)
        }
      </div>
    </>
  )
}

export const MediaBox = ({ media }: any) => {

  return (
    <>
      {
        media?.messageType === "image" ? <ImageMedia media={media} /> : <AudioVideoMedia media={media} />
      }
    </>
  )

}

export const ImageMedia = ({ media }: any) => {

  const { userId } = useParams()
  const navigate = useNavigate()

  return (
    <>
      <div className="imageMediaBox" onClick={() => navigate(`/chat/${userId}`, { state: { messageId: media?._id } })}>
        <img src={media?.contentUrl} alt="image" />
      </div>
    </>
  )

}

export const AudioVideoMedia = ({ media }: any) => {

  const navigate = useNavigate()
  const { userId } = useParams()

  return (
    <>
      <div className="audioMediaBox" onClick={() => navigate(`/chat/${userId}`, { state: { messageId: media?._id } })}>
        {media?.messageType === "audio" && <FaMicrophone />}
        {media?.messageType === "video" && <FaVideo />}
        <p>{media?.messageType}</p>
      </div>
    </>
  )

}

const MediaSection = ({ user }: any) => {

  const [media, setMedia] = useState<any[]>([])

  useEffect(() => {
    getMedia()
  }, [user?._id])

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