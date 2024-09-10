import "./Main.css"
import DraggableBox from "../../../../../components/mui/DraggableBox"

const VoiceCall = ({ open, setOpen, user, setUser }: any) => {
    return (
        <>
            <DraggableBox open={open} setOpen={setOpen} user={user} setUser={setUser} />
        </>
    )
}

export default VoiceCall