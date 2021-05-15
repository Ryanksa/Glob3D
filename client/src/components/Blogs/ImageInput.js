import React, { useState } from 'react';
import './Blogs.scss';
import DragAndDrop from '../DragAndDrop/DragAndDrop';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';

const ImageInput = (props) => {
    const [imageUrl, setImageUrl] = useState("");

    const handleInputChange = (event) => {
        if (event.target.files.length === 0) return; 
        if(event.target.files[0].type.match("image.*")) {
            setImageUrl(URL.createObjectURL(event.target.files[0]));
        } else {
            props.handleError("Only image types are accepted");
        }
    };

    const handleDropFiles = (files) => {
        if (files[0].type.match("image.*")) {
            setImageUrl(URL.createObjectURL(files[0]));
            document.querySelector(`#${props.id} input[type='file']`).files = files;
        } else {
            props.handleError("Only image types are accepted");
        }
    };

    if (imageUrl.length > 0) {
        return(
            <DragAndDrop handleDropFiles={handleDropFiles} style={{
                border: "3px dashed rgb(70, 70, 70)",
                backgroundColor: 'rgba(255, 255, 255, 0.7)'
            }}>
                <div id={props.id} className="blog-section blog-image-input blog-image-preview">
                    <input type="file" onChange={handleInputChange}/>
                    <img src={imageUrl} alt="" className="blog-image"/>
                </div>
            </DragAndDrop>
        );
    }
    return(
        <DragAndDrop handleDropFiles={handleDropFiles} style={{
            border: "3px dashed rgb(70, 70, 70)",
            backgroundColor: 'rgba(255, 255, 255, 0.7)'
        }}>
            <div id={props.id} className="blog-section blog-image-input">
                <input type="file" onChange={handleInputChange}/>
                <div>Choose an image or drag it here</div>
                <CloudUploadIcon style={{fontSize: 60}}/>
            </div>
        </DragAndDrop>
    );
};

export default ImageInput;