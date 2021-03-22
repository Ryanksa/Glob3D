import React from 'react';
import PropTypes from 'prop-types';
import './Signout.scss';

import { Button, FormControl, Input, InputLabel } from '@material-ui/core';
import { Redirect } from 'react-router';

import UserContext from '../../contexts/UserContext'; 

class Signout extends React.Component {
  static contextType = UserContext;

  constructor(props) {
    super(props);

    // https://stackoverflow.com/a/43230829
    this.state = {
      redirect: false
    };
  }

  componentDidMount() {
    fetch('/graphql', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: `
        query {
          signout
        }` 
      }),
      credentials: "include"
    }).then((res) => {
      return res.json();
    }).then((res) => {
      this.context.updateUser({});
      this.setState({ redirect: true });
    });
  }

  render() {
    if(this.state.redirect) {
      return <Redirect to='/'/>
    }
    return (
      <div className="signout-wrapper">
        <h1>Signing you out...</h1>
      </div>
    );
  }
}

export default Signout;
