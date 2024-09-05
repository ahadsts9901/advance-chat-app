import "./Main.css"
import { IconButton } from "@mui/material"
import fallBackProfileImage from "/default_avatar.png"
import { IoArrowBackOutline } from "react-icons/io5";

const DataSection = ({ user }: any) => {
  return (
    <>
      <div className="dataSection">
        <>
          <IconButton onClick={() => window.history.back()} className="profile-back-button"><IoArrowBackOutline /></IconButton>
        </>
        <img src={user?.profilePhoto} alt="profile photo"
          onError={(e: any) => {
            e.target.src = fallBackProfileImage
            e.target.style.padding = "0.4em"
          }}
        />
        <h4>{user?.userName}</h4>
        <p>{user?.email?.toLowerCase()}</p>
      </div>
    </>
  )
}

export default DataSection