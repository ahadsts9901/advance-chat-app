import React, { useRef } from 'react';
import Draggable from 'react-draggable';

const DraggableBox = ({ children }: any) => {
    const boxRef = useRef(null)

    return (
        <Draggable nodeRef={boxRef}>{React.cloneElement(children, { ref: boxRef })}</Draggable>
    )
}

export default DraggableBox;