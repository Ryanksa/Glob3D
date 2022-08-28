import React, { useState, useContext, useEffect, useRef } from "react";
import "./Blogs.scss";
import ParagraphInput from "./ParagraphInput";
import ImageInput from "./ImageInput";
import UserContext from "../../contexts/userContext";
import { createBlog } from "../../utils/blog";
import { Redirect } from "react-router";
import DescriptionIcon from "@material-ui/icons/Description";
import ImageIcon from "@material-ui/icons/Image";
import { Button, IconButton } from "@material-ui/core";
import { uploadFile } from "../../utils/fetchService";

const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "June",
  "July",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];
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
      {months[date.getMonth()]} {day}
      <sup>{superscript}</sup>, {date.getFullYear()}
    </span>
  );
}

const WriteBlogs = () => {
  const [content, setContent] = useState([]);
  const [redirect, setRedirect] = useState(false);
  const context = useContext(UserContext);
  const titleRef = useRef(null);

  useEffect(() => {
    if (titleRef.current) {
      titleRef.current.focus();
    }
  }, []);

  // user creates blog
  const handleCreateBlog = () => {
    const sections = document.querySelectorAll(
      ".blog-section:not(.blog-section-selector)"
    );
    const imageList = [];
    const promiseList = [];
    const contentList = [];

    // upload all the images to the server first
    document
      .querySelectorAll(".blog-section.blog-image-input.blog-image-preview")
      .forEach((imageSection) => {
        const image = imageSection.querySelector("input[type='file']").files[0];
        promiseList.push(uploadFile("/api/images/", { image }));
      });
    Promise.all(promiseList)
      .then((res) => {
        // store the new image names from the responses
        res.forEach((newFileName) => {
          imageList.push("::img::" + newFileName + "::img::");
        });

        // build the content list based on each section (paragraph or image)
        let imageIdx = 0;
        sections.forEach((section, idx) => {
          if (content[idx] === "paragraph") {
            contentList.push(section.querySelector("textarea").value);
          } else if (content[idx] === "image") {
            contentList.push(imageList[imageIdx]);
            imageIdx++;
          }
        });

        // grab the title from the DOM
        let title = "";
        if (titleRef.current) {
          title = titleRef.current.innerHTML.replace(/(<([^>]+)>)/gi, "");
        }

        return createBlog(
          '"""' + title + '"""',
          '["""' + contentList.join('""", """') + '"""]'
        );
      })
      .then(() => {
        setRedirect(true);
      })
      .catch(() => {
        context.handleError(
          "Something went wrong when writing a blog. Please try again!"
        );
      });
  };

  const insertParagraphSection = () => {
    setContent([...content, "paragraph"]);
  };

  const insertImageSection = () => {
    setContent([...content, "image"]);
  };

  const currDate = new Date();
  if (redirect) {
    return <Redirect to="/world" />;
  }
  return (
    <div className="blog-screen-wrapper">
      <Button
        variant="contained"
        className="back-button"
        onClick={() => setRedirect(true)}
      >
        {"< Back to World"}
      </Button>
      <div className="blog-container">
        <div className="blog-details">
          <div
            className="blog-title"
            type="text"
            contentEditable
            ref={titleRef}
          >
            Title of Blog
          </div>
          <div className="blog-author">By {context.user.name}</div>
          <div className="blog-date">
            Posted on {formatPostedDate(currDate)}
          </div>
        </div>

        {content.map((section, idx) => (
          <>
            {section === "paragraph" && <ParagraphInput key={idx} />}
            {section === "image" && (
              <ImageInput
                key={idx}
                id={"image" + idx}
                handleError={context.handleError}
              />
            )}
          </>
        ))}

        <div className="blog-section-selector blog-section">
          <IconButton
            className="selector-button"
            onClick={insertParagraphSection}
          >
            <DescriptionIcon
              style={{ fontSize: 50 }}
              className="selector-icon"
            />
            Write a paragraph
          </IconButton>
          <IconButton className="selector-button" onClick={insertImageSection}>
            <ImageIcon style={{ fontSize: 50 }} className="selector-icon" />
            Upload an image
          </IconButton>
        </div>

        <Button color="primary" variant="contained" onClick={handleCreateBlog}>
          Create
        </Button>
      </div>
    </div>
  );
};

export default WriteBlogs;
