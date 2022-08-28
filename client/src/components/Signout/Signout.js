import React from "react";
import "./Signout.scss";

import { Redirect } from "react-router";

import UserContext from "../../contexts/userContext";
import { signout as signoutHelper } from "../../utils/auth";

class Signout extends React.Component {
  static contextType = UserContext;

  constructor(props) {
    super(props);

    // https://stackoverflow.com/a/43230829
    this.state = {
      redirect: false,
    };
  }

  componentDidMount() {
    signoutHelper()
      .then((res) => {
        this.context.updateUser({});
        this.setState({ redirect: true });
      })
      .catch((res) => {
        this.context.handleError(
          `Something went wrong when signing out! Please try again.`
        );
      });
  }

  render() {
    if (this.state.redirect) {
      return <Redirect to="/" />;
    }
    return (
      <div className="signout-wrapper">
        <h1>Signing you out...</h1>
      </div>
    );
  }
}

export default Signout;
