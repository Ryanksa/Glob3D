import React from 'react';
import './Error.scss';

import { Alert } from '@material-ui/lab';
import UserContext from '../../contexts/userContext';

class Error extends React.Component {
  renderErrors = (context) => {
    let renderedErrors = [];
    const errors = context.errors;

    errors.forEach((error, i) => {
      renderedErrors.push(
        <Alert severity="error" onClose={() => {
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
