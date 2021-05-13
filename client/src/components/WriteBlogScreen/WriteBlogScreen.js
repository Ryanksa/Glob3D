import React, { useState, useContext } from 'react';
import './WriteBlogScreen.scss';
import { fetchGraphql } from '../../utils/fetchService';
import UserContext from '../../contexts/userContext';
import { Redirect } from 'react-router';
import DescriptionIcon from '@material-ui/icons/Description';
import ImageIcon from '@material-ui/icons/Image';
import { IconButton } from '@material-ui/core';
import TextField from '@material-ui/core/TextField';

function sendFiles(method, url, data, callback){
  let formdata = new FormData();
  Object.keys(data).forEach(function(key){
      let value = data[key];
      formdata.append(key, value);
  });
  let xhr = new XMLHttpRequest();
  xhr.onload = function() {
      if (xhr.status !== 200) callback("[" + xhr.status + "]" + xhr.responseText, null);
      else callback(null, JSON.parse(xhr.responseText));
  };
  xhr.open(method, url, true);
  xhr.send(formdata);
}

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

const ParagraphInput = () => (
  <TextField
    className="blog-paragraph-input blog-section"
    label="Write a paragraph..."
    multiline
    rows={10}
    variant="outlined"
  />
);

const ImageInput = () => (
  <></>
);

const WriteBlogScreen = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState([]);
  const [redirect, setRedirect] = useState(false);
  const context = useContext(UserContext);

  // user creates blog
  const createBlog = () => {
    return fetchGraphql(`
      query{
        getUserPosition
      }
    `)
    .then((res) => {
      return res.json();
    })
    .then(({ data }) => {
      return fetchGraphql( `
        mutation {
          createBlog(title:"${title}", 
                    content: ${content}
                    position : [${data.getUserPosition[0]}, ${data.getUserPosition[1]}]) {
            _id
            title
            content
            date
          }
        }
      `).then(() => {  
        setRedirect(true);
      })
    }).catch(() => {
      context.handleError("Something went wrong when writing a blog. Please try again!");
    });
  }

  const currDate = new Date();
  if (redirect) return (<Redirect to='/world'/>);
  return (
    <div className="blog-screen-wrapper">
      <div className="blog-form">
        <div className="blog-details">
          <input className="blog-title-input" type="text" placeholder="Title of Blog"
                onClick={(event) => setTitle(event.target.value)} />
          <h4 className="blog-author">By {context.user.name}</h4>
          <h4 className="blog-date">Posted on {formatPostedDate(currDate)}</h4>
        </div>
        
        <ParagraphInput/>

        <div className="blog-section-selector blog-section">
          <IconButton className="selector-button">
            <DescriptionIcon style={{ fontSize: 50 }} className="selector-icon"/>
            Write a paragraph
          </IconButton>
          <IconButton className="selector-button">
            <ImageIcon style={{ fontSize: 50 }} className="selector-icon"/>
            Upload an image
          </IconButton>
        </div>
      </div>
    </div>
  );
}

export default WriteBlogScreen;