import React, { useState, useContext } from 'react';
import './WriteBlogScreen.scss';
import ParagraphInput from './ParagraphInput';
import ImageInput from './ImageInput';
import UserContext from '../../contexts/userContext';
import { createBlog } from '../../utils/blog';
import { Redirect } from 'react-router';
import DescriptionIcon from '@material-ui/icons/Description';
import ImageIcon from '@material-ui/icons/Image';
import { Button, IconButton } from '@material-ui/core';
import { uploadFile } from '../../utils/fetchService';

const months = ["Jan", "Feb", "Mar", "Apr", "May", "June", "July", "Aug", "Sep", "Oct", "Nov", "Dec"];
function formatPostedDate(date) {
  let day = date.getDate();
  let superscript = "th";
  if (day === 1 || day === 21 || day === 31) {
    superscript = "st";
  } else if (day === 2 || day === 22) {
    superscript = "nd";
  } else if (day === 3 || day === 23) {
    superscript = "rd";
  }
  return (
    <span>
      {months[date.getMonth()]} {day}<sup>{superscript}</sup>, {date.getFullYear()}
    </span>
  );
};

const WriteBlogScreen = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState([]);
  const [redirect, setRedirect] = useState(false);
  const context = useContext(UserContext);

  // user creates blog
  const handleCreateBlog = () => {
    const sections = document.querySelectorAll(".blog-section:not(.blog-section-selector)");
    const imageList = [];
    const promiseList = [];
    const contentList = [];

    // upload all the images to the server first
    document.querySelectorAll(".blog-section.blog-image-input")
      .forEach((imageSection) => {
        const image = imageSection.querySelector("input[type='file']").files[0];
        promiseList.push(uploadFile("/api/images/", { image }));
      });
    Promise.all(promiseList)
      .then((res) => {
        // store the new image names returned in imageList
        res.forEach((newFileName) => {
          imageList.push("::img::" + newFileName + "::img::");
        });

        let imageIdx = 0;
        sections.forEach((section, idx) => {
          if (content[idx] === "paragraph") {
            contentList.push(section.querySelector("textarea").value);
          } else if (content[idx] === "image") {
            contentList.push(imageList[imageIdx]);
            imageIdx++;
          }
        });
        
        return createBlog(title, '["""' + contentList.join('""", """') + '"""]');
      })
      .then(() => {
        setRedirect(true);
      })
      .catch(() => {
        context.handleError("Something went wrong when writing a blog. Please try again!");
      });
  };

  const insertParagraphSection = () => {
    setContent([...content, 'paragraph']);
  };

  const insertImageSection = () => {
    setContent([...content, 'image']);
  };

  const currDate = new Date();
  if (redirect) return (<Redirect to='/world'/>);
  return (
    <div className="blog-screen-wrapper">
      <div className="blog-form">
        <div className="blog-details">
          <input className="blog-title-input" type="text" placeholder="Title of Blog"
                onChange={(event) => setTitle(event.target.value)} />
          <h4 className="blog-author">By {context.user.name}</h4>
          <h4 className="blog-date">Posted on {formatPostedDate(currDate)}</h4>
        </div>

        {content.map((section, idx) => {
          if (section === 'paragraph') {
            return <ParagraphInput key={idx}/>;
          } else if (section === 'image') {
            return <ImageInput key={idx} id={"image" + idx}
                              handleError={context.handleError} />;
          }
        })}

        <div className="blog-section-selector blog-section">
          <IconButton className="selector-button" onClick={insertParagraphSection}>
            <DescriptionIcon style={{ fontSize: 50 }} className="selector-icon"/>
            Write a paragraph
          </IconButton>
          <IconButton className="selector-button" onClick={insertImageSection}>
            <ImageIcon style={{ fontSize: 50 }} className="selector-icon"/>
            Upload an image
          </IconButton>
        </div>

        <Button variant="contained" onClick={handleCreateBlog}>Create</Button>
      </div>
    </div>
  );
}

export default WriteBlogScreen;