import "./Main.css"
import DraggableBox from "../../../../../components/mui/DraggableBox"

const VoiceCall = ({ open, setOpen }: any) => {
    return (
        <>
            <DraggableBox open={open} setOpen={setOpen} />
        </>
    )
}

export default VoiceCall