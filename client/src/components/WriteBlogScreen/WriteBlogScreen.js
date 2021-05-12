import React from 'react';
import './WriteBlogScreen.scss';
import { fetchGraphql } from '../../utils/fetchService';
import UserContext from '../../contexts/userContext';

import { Button, FormControl, Input, InputLabel, TextField } from '@material-ui/core';
import { Redirect } from 'react-router';

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

class WriteBlogScreen extends React.Component {
  static contextType = UserContext;

  constructor(props) {
    super(props);
    this.state = {
      title: "",
      content:"",
      redirect: false,
    };
    this.handleChange = this.handleChange.bind(this);
    this.createBlog = this.createBlog.bind(this);
  }

  // user creates blog
  createBlog = () => {
    return fetchGraphql(`
      query{
        getUserPosition
      }
      `
    ).then((res) => {
      return res.json();
    }).then((res) => {
      return fetchGraphql( `
        mutation {
          createBlog(title:"${this.state.title}", 
                    content: [${this.state.content}]
                    position : [${res.data.getUserPosition[0]}, ${res.data.getUserPosition[1]}]) {
            _id
            title
            content
            date
          }
        }
      `).then((res) => {  
        this.setState({ redirect: true });
      })
    }).catch((err) => {
      this.context.handleError("Something went wrong when writing a blog. Please try again!");
    });
  }

  // handling user input code adapted from https://stackoverflow.com/a/43746799
  handleChange(event) {
    event.persist();
    this.setState({ [event.target.id]: event.target.value });
  }

  render() {
    // const {count} = this.state;
    if(this.state.redirect) {
      return <Redirect to='/world'/>
    }
    return (
      <div className="blog-screen-wrapper">
        <div className="blog-form">
          <h1>Write a Blog</h1>
          <FormControl classes={{ root: "blog-form-field" }}>
            <InputLabel htmlFor="title">Blog Title</InputLabel>
            <Input id="title" aria-describedby="Blog Title" required={true} onChange={this.handleChange}/>
          </FormControl>
          <FormControl classes={{ root: "blog-form-field" }}>
            <TextField id="content" label="Content" multiline aria-describedby="Content" required={true} type="textarea" onChange={this.handleChange}/>
          </FormControl>
          <Button variant="contained" classes={{ root: "blog-submit-button" }} onClick={this.createBlog}>Create</Button>
        </div>
      </div>
    );
  }
}

export default WriteBlogScreen;