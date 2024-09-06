import "./Main.css"
import { IconButton } from "@mui/material"
import { IoArrowBackOutline } from "react-icons/io5";
import { AntdImage as Image } from "../../../components/antd/Image"
import { useDispatch, useSelector } from "react-redux";
import { MdModeEditOutline } from "react-icons/md";
import { useEffect, useState } from "react";
import fallBackProfileImage from "/default_avatar.png"
import FormDialogue from "../../../components/mui/FormDialogue";
import axios from "axios";
import { baseUrl } from "../../../core";
import { login } from "../../../redux/user";

const DataSection = ({ user, fileRef, base64Url, setUser, setContacts }: any) => {

  const currentUser = useSelector((state: any) => state?.user)

  const dispatch = useDispatch()

  const [editingUserName, setEditingUserName] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [text, setText] = useState<null | string>(null)

  useEffect(() => {
    setText(currentUser?.userName)
  }, [currentUser])

  const updateUsername = async () => {

    if (!text || text?.trim() === "") return
    if (text?.trim() === currentUser?.userName?.trim()) return

    try {

      setIsLoading(true)

      const resp = await axios.put(`${baseUrl}/api/v1/username`, { userName: text }, {
        withCredentials: true
      })

      setText(resp?.data?.data)
      setUser({ ...user, userName: resp?.data?.data })
      dispatch(login({ ...currentUser, userName: resp?.data?.data }))
      setContacts((contacts: any) => contacts?.map((contact: any) =>
        contact?._id?.toString() === currentUser?._id?.toString() ? { ...contact, userName: resp?.data?.data } : contact
      ))
      setEditingUserName(false)
      setIsLoading(false)

    } catch (error) {
      console.error(error)
      setIsLoading(false)
    }

  }

  return (
    <>
      <FormDialogue
        open={editingUserName}
        setOpen={setEditingUserName}
        text={text}
        setText={setText}
        isLoading={isLoading}
        fun={updateUsername}
        message="Update username"
        button="Update"
      />
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
                onClick={() => setEditingUserName(true)}
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