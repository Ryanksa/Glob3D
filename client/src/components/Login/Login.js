import React from 'react';
import './Login.scss';

import { Button, FormControl, Input, InputLabel } from '@material-ui/core';
import { Redirect } from 'react-router';

import UserContext from '../../contexts/userContext';
import { login as loginHelper } from '../../utils/auth';

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
    loginHelper(this.state.email, this.state.password)
      .then((res) => {
        if (res.errors && res.errors.length > 0) {
          throw res.errors[0].message;
        }
        if(res.data) {
          this.context.updateUser(res.data.signin);
          this.setState({ redirect: true });
        }
      })
      .catch((err) => {
        if (err && err.length > 0) {
          this.context.handleError(err);
        } else {
          this.context.handleError(`Something went wrong when signing up! Please try again.`);
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
