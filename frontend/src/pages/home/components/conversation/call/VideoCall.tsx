import "./Main.css"
import DraggableBox from "../../../../../components/mui/DraggableBox"

const VideoCall = ({ open, setOpen, user, setUser }: any) => {

    return (
        <>
            <DraggableBox open={open} setOpen={setOpen} user={user} setUser={setUser} />
        </>
    )
}

export default VideoCall