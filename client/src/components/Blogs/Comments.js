import React, { useState, useEffect, useContext, useRef, useCallback } from 'react';
import './Blogs.scss';
import UserContext from '../../contexts/userContext';
import { createComment, getComments, countComments } from '../../utils/comment';

import { Button, TextField } from '@material-ui/core';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';

const NUM_COMMENTS_PER_PAGE = 10;

const Comments = (props) => {
    const context = useContext(UserContext);
    
    const [comments, setComments] = useState([]);
    const [currCommentPage, setCurrCommentPage] = useState(1); // first page is page 1 (not 0)
    const [numCommentPages, setNumCommentPages] = useState(1);
    const [currComment, setCurrComment] = useState("");

    // function that updates comment list by either replacing or appending the given page
    const updateComments = (page = 1, append = false) => {
        getComments(props.blogId, NUM_COMMENTS_PER_PAGE * page, NUM_COMMENTS_PER_PAGE * (page - 1))
            .then(({ data, errors }) => {
                if (errors) {
                    throw errors[0].message;
                }

                const newComments = data.comments.map((comment) => {
                    return {
                    _id: comment._id,
                    content: comment.content,
                    date: comment.date,
                    author: comment.user.name
                    }
                });

                if (append) {
                    setComments((existingComments) => {
                    return [...existingComments, ...newComments]
                    });
                } else {
                    setComments(newComments);
                }
            })
            .catch((err) => {
                context.handleError("Something went wrong when reading this blog's comments. Please try again!");
            });
    };

    // updates numCommentPages with the up-to-date number of comments
    const updateAvailableCommentPages = () => {
        countComments(props.blogId)
            .then(({ data }) => {
                setNumCommentPages(Math.ceil(data.numComments / NUM_COMMENTS_PER_PAGE));
            })
            .catch((err) => {
                context.handleError("Something went wrong when reading this blog's comments. Please try again!");
            });
    };
    
    // this enables continuous (infinite) scrolling on comments
    const observer = useRef();
    const lastCommentRef = useCallback((node) => {
        if (observer.current) observer.current.disconnect();
        observer.current = new IntersectionObserver((entries) => {
            if (currCommentPage < numCommentPages && entries[0].isIntersecting) {
                updateComments(currCommentPage + 1, true);
                setCurrCommentPage(currCommentPage + 1);
            }
        });
        if (node) observer.current.observe(node);
    }, [currCommentPage, numCommentPages]);

    const handleCreateComment = () => {
        if (currComment.length === 0) return;
        return createComment(props.blogId, '"""' + currComment + '"""')
          .then(() => {
            updateComments();
            updateAvailableCommentPages();
            setCurrComment("");
            setCurrCommentPage(1);
          })
          .catch((err) => {
            context.handleError("Something went wrong when writing a comment. Please try again!");
          });
    };

    useEffect(() => {
        updateComments();
        updateAvailableCommentPages();
    }, []);

    return(
        <div className="blog-comments">
            <h2 className="comment-header">Comments</h2>
            <div className="write-comment">
                <div className="current-user">
                    <AccountCircleIcon color="primary" fontSize="large"/>
                    {context.user.name}
                </div>
                    <TextField label="Your Comment" multiline aria-describedby="Your Comment" type="textarea" 
                                value={currComment} fullWidth onChange={(event) => setCurrComment(event.target.value)}/>
                    <Button color="primary" variant="contained" onClick={handleCreateComment}>
                        Submit
                    </Button>
            </div>

            {comments.map((comment, idx) => (
                <div className="comment-item" ref={comments.length === idx + 1 ? lastCommentRef : null}>
                    <div className="comment-info">
                        <div className="comment-author">
                            <AccountCircleIcon color="primary"/>{comment.author}
                        </div>
                        <div className="comment-date">
                            posted on {props.formatPostedDate(new Date(Number(comment.date)), false)}
                        </div>
                    </div>
                    <div className="comment-content">
                        {comment.content}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default Comments;