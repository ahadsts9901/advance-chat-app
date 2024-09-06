import "./Main.css"
import { IconButton } from "@mui/material"
import fallBackProfileImage from "/default_avatar.png"
import { IoArrowBackOutline } from "react-icons/io5";
import { AntdImage as Image } from "../../../components/antd/Image"
import { useSelector } from "react-redux";
import { MdModeEditOutline } from "react-icons/md";

const DataSection = ({ user, fileRef, base64Url }: any) => {

  const currentUser = useSelector((state: any) => state?.user)

  return (
    <>
      <div className="dataSection">
        <>
          <IconButton onClick={() => window.history.back()} className="profile-back-button"><IoArrowBackOutline /></IconButton>
        </>
        <div className="image-sts">
          <Image src={base64Url ? base64Url : user?.profilePhoto} alt="profile photo"
            onError={(e: any) => {
              e.target.src = fallBackProfileImage
              e.target.style.padding = "0.4em"
            }}
          />
          <>
            {currentUser?._id == user?._id ?
              <IconButton className="edit-button" size="small"
                onClick={() => fileRef?.current?.click()}
              >
                <MdModeEditOutline />
              </IconButton>
              : null}
          </>
        </div>
        <h4>
          {user?.userName} {currentUser?._id == user?._id ? "(You)" : ""}
          <>
            {currentUser?._id == user?._id ?
              <IconButton
                className="edit-name-button" size="small"
              ><MdModeEditOutline /></IconButton>
              : null}
          </>
        </h4>
        <p>{user?.email?.toLowerCase()}</p>
      </div>
    </>
  )
}

export default DataSection