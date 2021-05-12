import React from 'react';
import './ReadBlogScreen.scss';
import { fetchGraphql } from '../../utils/fetchService';
import UserContext from '../../contexts/userContext';

import { Button, FormControl, TextField } from '@material-ui/core';
import { Redirect } from 'react-router';

const NUM_COMMENTS_PER_PAGE = 10;

class ReadBlogScreen extends React.Component {
  static contextType = UserContext;

  constructor(props, context) {
    super(props, context);
    this.state = {
      title: "",
      content:"",
      author: "",
      date: new Date().getTime().toString(),
      comments: [],
      comment: "",
      isLiked: false,
      redirect: false,
      commentPages: 1
    };
    this.handleChange = this.handleChange.bind(this);
    this.getUserContext = this.getUserContext.bind(this);
  }

  getUserContext = () => {
    return this.context.user;
  };

  componentDidMount = () => {
    fetchGraphql(`
      query {
        blogs(first: 1, after: 0, blogId: "${this.getBlogId()}") {
          title
          content
          date
          author {
            name
            email
          }
        }
      }
      `
    ).then((res) => {
      return res.json();
    }).then((res) => {
      const blog = res.data.blogs[0];
      this.setState({
        title: blog.title,
        content: blog.content[0],
        date: blog.date,
        author: blog.author.name
      });
    }).catch((err) => {
      this.context.handleError("Something went wrong when reading this blog. Please try again!");
    });

    this.updateComments();
  };

  updateComments = (page = 1) => {
    fetchGraphql(`
      query {
        comments(first: ${NUM_COMMENTS_PER_PAGE * page}, after: ${NUM_COMMENTS_PER_PAGE * (page - 1)}, blogId: "${this.getBlogId()}") {
          _id
          user {
            name
            email
          }
          blog {
            _id
          }
          content
          date
        }
      }
      `
    ).then((res) => {
      return res.json();
    }).then((res) => {
      this.setState({
        comments: res.data.comments.map((comment) => {
          return {
            _id: comment._id,
            content: comment.content,
            date: comment.date,
            author: comment.user.name
          }
        })
      });
    }).catch((err) => {
      this.context.handleError("Something went wrong when reading this blog's comments. Please try again!");
    });

    fetchGraphql(`
      query {
        numComments(blogId: "${this.getBlogId()}")
      }
      `
    ).then((res) => {
      return res.json();
    }).then((res) => {
      this.setState({
        commentPages: Math.ceil(res.data.numComments / NUM_COMMENTS_PER_PAGE)
      });
    }).catch((err) => {
      this.context.handleError("Something went wrong when reading this blog's comments. Please try again!");
    });
  };

  createComment = () => {
    return fetchGraphql(`
      mutation {
        addComment(blogId:"${this.getBlogId()}", content:"${this.state.comment}") {
          _id
          user {
            name
            email
          }
          blog {
            _id
          }
          content
          date
        }
      }
      `
    ).then((res) => {
      return res.json();
    }).then((res) => {
      this.updateComments();
    }).catch((err) => {
      this.context.handleError("Something went wrong when writing a comment. Please try again!");
    });
  };

  getBlogId = () => {
    return this.props.match.params.id;
  };

  getStringifiedDate = (dateInSeconds) => {
    const readableDate = new Date(0);
    readableDate.setUTCSeconds(dateInSeconds / 1000);  // convert seconds to ms
    return readableDate.toLocaleDateString();
  };

  // handling user input code adapted from https://stackoverflow.com/a/43746799
  handleChange(event) {
    event.persist();
    this.setState({ [event.target.id]: event.target.value });
  }

  renderComments = () => {
    let commentsList = [];
    this.state.comments.forEach((comment) => {
      commentsList.push(
        <div>
          <h3>Comment by {comment.author} on {this.getStringifiedDate(comment.date)}</h3>
          <p>{comment.content}</p>
        </div>
      );
    });
    return commentsList;
  };

  renderCommentPages = () => {
    let commentPagesList = [];
    for(let i = 0; i < this.state.commentPages; i++) {
      commentPagesList.push(
        <li>
          <button onClick={() => this.updateComments(i + 1)}>{i + 1}</button>
        </li>
      );
    }
    return commentPagesList;
  };

  returnWorld = () => {
    this.setState({
      redirect: true
    });
  };

  render() {
    // const {count} = this.state;
    if(this.state.redirect) {
      return <Redirect to='/world'/>
    }
    return (
      <div className="blog-screen-wrapper">
        <div className="blog-form">
          <Button variant="contained" classes={{ root: "world-return-button" }} onClick={this.returnWorld}>{"< World"}</Button>
          <div className="blog-details">
            <h1>{this.state.title}</h1>
            <h2>By {this.state.author} on {this.getStringifiedDate(this.state.date)}</h2>
          </div>
          <div className="blog-contents">
            <p className="display-linebreak">{this.state.content}</p>
          </div>
          <div className="blog-comments">
            <h2>Comments</h2>
            <ul>{this.renderCommentPages()}</ul>
            {this.renderComments()}
            <div className="blog-comments-write">
              <FormControl classes={{ root: "blog-form-field" }}>
                <TextField id="comment" label="Comment" multiline aria-describedby="Comment" required={true} type="textarea" onChange={this.handleChange}/>
              </FormControl>
              <Button variant="contained" classes={{ root: "blog-comment-submit-button" }} onClick={this.createComment}>Submit</Button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default ReadBlogScreen;