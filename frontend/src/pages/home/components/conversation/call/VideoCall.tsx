import "./Main.css"
import DraggableBox from "../../../../../components/mui/DraggableBox"

const VideoCall = ({ open, setOpen }: any) => {
    return (
        <>
            <DraggableBox
                open={open} setOpen={setOpen}
            />
        </>
    )
}

export default VideoCall