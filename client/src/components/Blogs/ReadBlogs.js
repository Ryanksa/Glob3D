import React, { useContext, useState, useEffect } from 'react';
import './Blogs.scss';
import Comments from './Comments';
import UserContext from '../../contexts/userContext';
import { getBlog } from '../../utils/blog';

import { Button } from '@material-ui/core';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import { Redirect } from 'react-router';

const months = ["Jan", "Feb", "Mar", "Apr", "May", "June", "July", "Aug", "Sep", "Oct", "Nov", "Dec"];
function formatPostedDate(date, includeYear = true) {
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
      {months[date.getMonth()]} {day}<sup>{superscript}</sup>
      {includeYear ? (", " + date.getFullYear()) : ""}
    </span>
  );
};

const ReadBlogs = (props) => {
  const context = useContext(UserContext);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState([]);
  const [author, setAuthor] = useState("");
  const [date, setDate] = useState(new Date());
  const [redirect, setRedirect] = useState(false);
  const blogId = props.match.params.id;

  useEffect(() => {
    getBlog(blogId, true, true, true, true)
      .then(({ data }) => {
        const blog = data.blogs[0];
        setTitle(blog.title);
        setContent(blog.content);
        setDate(new Date(Number(blog.date)));
        setAuthor(blog.author.name);
      })
      .catch((err) => {
        context.handleError("Something went wrong when reading this blog. Please try again!");
      });
  }, []);

  if(redirect) {
    return <Redirect to='/world'/>
  }
  return (
    <div className="blog-screen-wrapper">
      <Button variant="contained" className="back-button" 
            onClick={() => setRedirect(true)}>
        {"< Back to World"}
      </Button>
      <div className="blog-container">
        <div className="blog-details">
          <div className="blog-title">{title}</div>
          <div className="blog-author"><AccountCircleIcon color="primary"/>{author}</div>
          <div className="blog-date">{formatPostedDate(date)}</div>
        </div>

        {content.map((section) => {
          if (section.startsWith("::img::") && section.endsWith("::img::")) {
            return <img className="blog-section blog-image" src={"/api/images/" + section.slice(7, -7)} alt="" />
          } else {
            return <p className="blog-section blog-paragraph">{section}</p>
          }
        })}

        <Comments blogId={blogId} formatPostedDate={formatPostedDate} />        
      </div>
    </div>
  );
};

export default ReadBlogs;