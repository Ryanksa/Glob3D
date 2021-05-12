import React from 'react';
import './Signup.scss';

import { Button, FormControl, FormHelperText, Input, InputLabel } from '@material-ui/core';
import { Redirect } from 'react-router';

import UserContext from '../../contexts/userContext';
import { signup as signupHelper, login as loginHelper } from '../../utils/auth';

class Signup extends React.Component {
  static contextType = UserContext;

  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      name: "",
      redirect: false
    };

    this.handleChange = this.handleChange.bind(this);   // handle input changes
    this.signup = this.signup.bind(this);
  }

  signup() {
    signupHelper(this.state.email, this.state.password, this.state.name)
    .then((res) => {
      return res.json();
    }).then((res) => {
      return loginHelper(this.state.email, this.state.password);
    }).then((res) => {
      return res.json();
    }).then((res) => {
      this.context.updateUser(res.data.signin);
      this.setState({ redirect: true });
    }).catch((res) => {
      this.context.handleError(`Something went wrong when signing up! Please try again.`);
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
      <div className="signup-wrapper">
        <div className="signup-form">
          <h1>Signup</h1>
          <FormControl classes={{ root: "signup-form-field" }}>
            <InputLabel htmlFor="name">Name</InputLabel>
            <Input id="name" aria-describedby="Name" required={true} onChange={this.handleChange}/>
            <FormHelperText>The name you want others to call you by.</FormHelperText>
          </FormControl>
          <FormControl classes={{ root: "signup-form-field" }}>
            <InputLabel htmlFor="email">Email address</InputLabel>
            <Input id="email" aria-describedby="Email address" required={true} onChange={this.handleChange}/>
          </FormControl>
          <FormControl classes={{ root: "signup-form-field" }}>
            <InputLabel htmlFor="password">Password</InputLabel>
            <Input id="password" aria-describedby="Password" required={true} type="password" onChange={this.handleChange}/>
          </FormControl>
          <Button variant="contained" classes={{ root: "signup-button" }} onClick={() => this.signup()}>Signup</Button>
        </div>
      </div>
    );
  }
}

export default Signup;
