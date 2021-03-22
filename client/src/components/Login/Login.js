import React from 'react';
import PropTypes from 'prop-types';
import './Login.scss';

import UserContext from '../../contexts/userContext';

import { Button, FormControl, Input, InputLabel } from '@material-ui/core';

import { Redirect } from 'react-router';

class Login extends React.Component {
  static contextType = UserContext;

  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      redirect: false
    };

    this.handleChange = this.handleChange.bind(this);   // handle input changes
    this.login = this.login.bind(this);
  }

  componentDidMount() {
    if(Object.keys(this.context.user) > 0) {
      this.setState({ redirect: true });
    }
  }

  login() {
    fetch('/graphql', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: `
        query {
          signin(email:"${this.state.email}", password:"${this.state.password}") {
            email
            name
          }
        }` 
      }),
      credentials: "include"
    }).then((res) => {
      return res.json();
    }).then((res) => {
      if(res.data) {
        this.context.updateUser(res.data.signin);
        this.setState({ redirect: true });
      }
    });
  }
  
  // handling user input code adapted from https://stackoverflow.com/a/43746799
  handleChange(event) {
    event.persist();
    this.setState({ [event.target.id]: event.target.value })
  }

  render() {
    if(this.state.redirect) {
      return <Redirect to='/world'/>
    }
    return (
      <div className="login-wrapper">
        <div className="login-form">
          <h1>Login</h1>
          <FormControl classes={{ root: "login-form-field" }}>
            <InputLabel htmlFor="email">Email address</InputLabel>
            <Input id="email" aria-describedby="Email address" required={true} onChange={this.handleChange}/>
          </FormControl>
          <FormControl classes={{ root: "login-form-field" }}>
            <InputLabel htmlFor="password">Password</InputLabel>
            <Input id="password" aria-describedby="Password" required={true} type="password" onChange={this.handleChange}/>
          </FormControl>
          <Button variant="contained" classes={{ root: "login-button" }} onClick={this.login}>Login</Button>
        </div>
      </div>
    );
  }
}

export default Login;
