import { IconButton } from '@mui/material';
import { RxCross2 } from "react-icons/rx";
import Draggable from 'react-draggable';

const DraggableBox = ({ open, setOpen }: any) => {
    console.log("open", open)
    return (
        <Draggable>
            <div
                style={{
                    width: '200px',
                    height: '200px',
                    background: 'red',
                    position: 'fixed',
                    zIndex: 20,
                    cursor: 'move'
                }}
            >
                call component
                <IconButton onClick={() => setOpen(false)}><RxCross2 /></IconButton>
            </div>
        </Draggable>
    );
};

export default DraggableBox;