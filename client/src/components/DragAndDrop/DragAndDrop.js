import React, { useRef, useEffect, useState } from 'react';
import './DragAndDrop.scss';

// code modified from https://medium.com/@650egor/simple-drag-and-drop-file-upload-in-react-2cb409d88929
const DragAndDrop = (props) => {
    const dropRef = useRef();
    const [dragging, setDragging] = useState(false);

    const { handleDropFiles } = props;
    useEffect(() => {
        let dragCounter = 0;

        const handleDragEnter = (event) => {
            event.preventDefault();
            event.stopPropagation();
            dragCounter++;
            if (event.dataTransfer.items && event.dataTransfer.items.length > 0) {
                setDragging(true);
            }
        };
    
        const handleDragLeave = (event) => {
            event.preventDefault();
            event.stopPropagation();
            dragCounter--;
            if (dragCounter > 0) return;
            setDragging(false);
        };
    
        const handleDragOver = (event) => {
            // overwrite the default behaviour of opening a file when dragged and dropped into browser 
            event.preventDefault();
            event.stopPropagation();
        };
    
        const handleDrop = (event) => {
            event.preventDefault();
            event.stopPropagation();
            setDragging(false);
            if (event.dataTransfer.files && event.dataTransfer.files.length > 0) {
                handleDropFiles(event.dataTransfer.files);
                dragCounter = 0;
            }
        };

        const div = dropRef.current;
        div.addEventListener('dragenter', handleDragEnter);
        div.addEventListener('dragleave', handleDragLeave);
        div.addEventListener('dragover', handleDragOver);
        div.addEventListener('drop', handleDrop);

        return () => {
            div.removeEventListener('dragenter', handleDragEnter);
            div.removeEventListener('dragleave', handleDragLeave);
            div.removeEventListener('dragover', handleDragOver);
            div.removeEventListener('drop', handleDrop);
        }
    }, [handleDropFiles]);

    return (
        <div ref={dropRef} className="drag-and-drop-wrapper">
            {dragging &&
                <div className="drag-and-drop-box" style={{...props.style}}>
                    <div className="drag-and-drop-text">
                        <div>{props.dragOverText}</div>
                    </div>
                </div>
            }
            {props.children}
        </div>
    );
};

export default DragAndDrop;