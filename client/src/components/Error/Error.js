import React from 'react';
import PropTypes from 'prop-types';
import './Error.scss';

import { Alert } from '@material-ui/lab';
import UserContext from '../../contexts/userContext';

class Error extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="error-wrapper">
        <UserContext.Consumer>
          {
            (context) => {
              return <Alert severity="error" onClose={() => {
                context.updateError("");
              }}>
                {this.props.error}
              </Alert>
            }
          }
        </UserContext.Consumer>
      </div>
    );
  }
}

export default Error;
