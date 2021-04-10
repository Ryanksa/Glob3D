import React from 'react';
import PropTypes from 'prop-types';
import './Error.scss';

import { Alert } from '@material-ui/lab';
import UserContext from '../../contexts/userContext';

class Error extends React.Component {
  constructor(props) {
    super(props);
  }

  renderErrors = (context) => {
    let renderedErrors = [];
    const errors = context.errors;

    errors.forEach((error, i) => {
      renderedErrors.push(
        <Alert severity="error" onClose={() => {
          console.log("removing " + error);
          context.removeError(error);
        }}>
          { error }
        </Alert>
      );
    });

    return renderedErrors;
  };

  render() {
    return (
      <div className="error-wrapper">
        <UserContext.Consumer>
          { (context) => this.renderErrors(context) }
        </UserContext.Consumer>
      </div>
    );
  }
}

export default Error;
