import React, { useState } from "react";
import "./Interface.scss";
import { Redirect } from "react-router-dom";

const Interface = (props) => {
  const [instruct, setInstruct] = useState(false);
  const [redirect, setRedirect] = useState(false);

  const onToggle = (e) => {
    e.stopPropagation();
    setInstruct(!instruct);
  };
  const leaveBlog = (e) => {
    e.stopPropagation();
    setRedirect(true);
  };

  if (redirect) {
    return <Redirect to="/blog" />;
  }
  return (
    <>
      <div className="Interface">
        <div className="instructions">
          {instruct ? (
            <>
              <div>
                <div className="wasd-icon instructions-icon"></div>
                <div>to move</div>
              </div>
              <div>
                <div className="click-icon instructions-icon"></div>
                <div>to look around</div>
              </div>
              <div>
                <div className="interact-icon instructions-icon"></div>
                <div>to interact</div>
              </div>
              <div className="toggle-instructions on" onClick={onToggle}></div>
            </>
          ) : (
            <>
              <div>Instructions</div>
              <div className="toggle-instructions off" onClick={onToggle}></div>
            </>
          )}
        </div>

        <div onClick={leaveBlog} className="write-blog-container">
          <div className="write-blog-text">Leave a</div>
          <div className="write-blog-icon"></div>
        </div>
      </div>

      {props.blogTitle.length > 0 && (
        <div className="curr-blog-container">
          <div className="curr-blog-title">{props.blogTitle}</div>
          <div className="curr-blog-author">By {props.blogAuthor}</div>
          <div className="curr-blog-instructions">Press spacebar to open</div>
        </div>
      )}
    </>
  );
};

export default Interface;
