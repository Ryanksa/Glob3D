import React from 'react';
import PropTypes from 'prop-types';
import './Signup.scss';

import UserContext from '../../contexts/UserContext';

import { Button, FormControl, FormHelperText, Input, InputLabel } from '@material-ui/core';

import { Redirect } from 'react-router';

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
    fetch('/graphql', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: `
        mutation {
          signup(email:"${this.state.email}", password:"${this.state.password}", name:"${this.state.name}") {
            email
            name
          }
        }` 
      }),
      credentials: "include"
    }).then((res) => {
      return res.json();
    }).then((res) => {
      this.context.updateUser(res.data.signup);
      this.setState({ redirect: true });
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
