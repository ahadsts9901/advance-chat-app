import "./main.css"
import ChatContacts from "./chat/ChatContacts"
import ChatHeader from "./chat/ChatHeader"
import ChatSearch from "./chat/ChatSearch"
import { useDispatch, useSelector } from "react-redux"
import VoiceCall from "./conversation/call/VoiceCall"
import VideoCall from "./conversation/call/VideoCall"
import { setIsVoiceCallOpen, setIsVideoCallOpen, setVideoCallData } from "../../../redux/user"

const Chats = ({ userId, getContacts, setContacts, contacts, filteredContacts, setFilteredContacts, is_accepted_call, set_is_accepted_call, is_lobby_call, set_is_lobby_call }: any) => {

    const dispatch = useDispatch()
    const currentUser = useSelector((state: any) => state?.user)
    const { isVideoCallOpen, isVoiceCallOpen } = currentUser

    const _setIsVoiceCallOpen = (option: boolean) => {
        dispatch(setIsVoiceCallOpen(option))
    }

    const _setIsVideoCallOpen = (option: boolean) => {
        dispatch(setVideoCallData(
            !option ? null :
                {
                    opponentUser: { _id: "", isActive: false },
                    currentUser: { _id: currentUser?._id }
                }
        ))
        dispatch(setIsVideoCallOpen(option))
    }

    return (
        <>
            {isVoiceCallOpen && !isVideoCallOpen && <VoiceCall open={isVoiceCallOpen} setOpen={_setIsVoiceCallOpen} />}
            {isVideoCallOpen && !isVoiceCallOpen && <VideoCall open={isVideoCallOpen} setOpen={_setIsVideoCallOpen} is_accepted_call={is_accepted_call} set_is_accepted_call={set_is_accepted_call} is_lobby_call={is_lobby_call} set_is_lobby_call={set_is_lobby_call} />}
            <div className="chatSection">
                <ChatHeader />
                <ChatSearch contacts={contacts} setContacts={setContacts} setFilteredContacts={setFilteredContacts} />
                <ChatContacts userId={userId} getContacts={getContacts} contacts={filteredContacts?.length ? filteredContacts : contacts} />
            </div>
        </>
    )
}

export default Chats