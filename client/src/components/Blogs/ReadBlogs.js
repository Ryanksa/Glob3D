import React, { useContext, useState, useEffect } from 'react';
import './Blogs.scss';
import UserContext from '../../contexts/userContext';
import { getBlog } from '../../utils/blog';
import { createComment, getComments, countComments } from '../../utils/comment';

import { Button, FormControl, TextField } from '@material-ui/core';
import { Redirect } from 'react-router';

const NUM_COMMENTS_PER_PAGE = 10;

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

const ReadBlogs = (props) => {
  const context = useContext(UserContext);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState([]);
  const [author, setAuthor] = useState("");
  const [date, setDate] = useState(new Date());
  const [comments, setComments] = useState([]);
  const [commentPages, setCommentPages] = useState(1);
  const [currComment, setCurrComment] = useState("");
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

      updateComments();
  }, []);

  const updateComments = (page = 1) => {
    getComments(blogId, NUM_COMMENTS_PER_PAGE * page, NUM_COMMENTS_PER_PAGE * (page - 1))
      .then(({ data, errors }) => {
        if (errors) {
          throw errors[0].message;
        }
        setComments(data.comments.map((comment) => {
          return {
            _id: comment._id,
            content: comment.content,
            date: comment.date,
            author: comment.user.name
          }
        }));
      })
      .catch((err) => {
        context.handleError("Something went wrong when reading this blog's comments. Please try again!");
      });

    countComments(blogId)
      .then(({ data }) => {
        setCommentPages(Math.ceil(data.numComments / NUM_COMMENTS_PER_PAGE));
      })
      .catch((err) => {
        context.handleError("Something went wrong when reading this blog's comments. Please try again!");
      });
  };

  const handleCreateComment = () => {
    return createComment(blogId, currComment)
      .then(() => {
        updateComments();
      })
      .catch((err) => {
        context.handleError("Something went wrong when writing a comment. Please try again!");
      });
  };

  const renderComments = () => {
    let commentsList = [];
    comments.forEach((comment) => {
      commentsList.push(
        <div>
          <h3>Comment by {comment.author} posted on {formatPostedDate(new Date(Number(comment.date)))}</h3>
          <p>{comment.content}</p>
        </div>
      );
    });
    return commentsList;
  };

  const renderCommentPages = () => {
    let commentPagesList = [];
    for(let i = 0; i < commentPages; i++) {
      commentPagesList.push(
        <li>
          <button onClick={() => updateComments(i + 1)}>Page {i + 1}</button>
        </li>
      );
    }
    return commentPagesList;
  };

  if(redirect) {
    return <Redirect to='/world'/>
  }
  return (
    <div className="blog-screen-wrapper">
      {/* <Button variant="contained" className="back-button" 
            onClick={() => setRedirect(true)}>
        {"< World"}
      </Button> */}
      <div className="blog-container">
        <div className="blog-details">
          <div className="blog-title">{title}</div>
          <div className="blog-author">By {author}</div>
          <div className="blog-date">{formatPostedDate(date)}</div>
        </div>

        {content.map((section) => {
          if (section.startsWith("::img::") && section.endsWith("::img::")) {
            return <img className="blog-section blog-image" src={"/api/images/" + section.slice(7, -7)} alt="" />
          } else {
            return <p className="blog-section blog-paragraph">{section}</p>
          }
        })}

        <div className="blog-comments">
          <h2>Comments</h2>
            <ul>{renderCommentPages()}</ul>
            {renderComments()}
            <div className="blog-comments-write">
              <FormControl>
                <TextField id="comment" label="Comment" multiline aria-describedby="Comment" 
                    required={true} type="textarea" onChange={(event) => setCurrComment(event.target.value)}/>
              </FormControl>
              <Button variant="contained" onClick={handleCreateComment}>Submit</Button>
            </div>
        </div>

      </div>
    </div>
  );
};

export default ReadBlogs;