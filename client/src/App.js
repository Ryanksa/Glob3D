import './App.css';

import Header from './components/Header/Header';
import Error from './components/Error/Error';
import Login from './components/Login/Login';
import Signout from './components/Signout/Signout';
import Credits from './components/Credits/Credits';
import World from './components/World/World';
import Landing from './components/Landing/Landing';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";
import Signup from './components/Signup/Signup';

import React from 'react';
import UserContext from './contexts/userContext';

const SESSION_USER_KEY = `GLOB3D_USER`;

class App extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      user: {},
      error: ""
    };
    
    this.updateUser = this.updateUser.bind(this);
    this.updateError = this.updateError.bind(this);
  }

  componentDidMount() {
    // attempt to restore user session
    try {
      const savedUser = JSON.parse(sessionStorage.getItem(SESSION_USER_KEY));
      if('email' in savedUser && 'name' in savedUser) this.setState({ user: savedUser });
    } catch(e) {
      sessionStorage.setItem(SESSION_USER_KEY, JSON.stringify({}));
    }
  }

  updateUser(user) {
    this.setState({
      user: user
    });
    sessionStorage.setItem(SESSION_USER_KEY, JSON.stringify(user));
  }

  updateError(error) {
    this.setState({
      error: error
    });
  }

  render() {
    // define context bundle to pass down to children
    const context = {
      user: this.state.user,
      updateUser: this.updateUser,
      updateError: this.updateError
    };

    return (
      <Router>
        <UserContext.Provider value={context}>
          <div className="App">
            <Header/>
            { this.state.error !== "" && <Error error={this.state.error}></Error> }
          </div>
          <div className="page-wrapper">
            <Switch>
              <Route path="/" exact>
                <Landing />
              </Route>
              <Route path="/signup">
                <Signup/>
              </Route>
              <Route path="/login">
                <Login/>
              </Route>
              <Route path="/signout">
                <Signout/>
              </Route>
              <Route path="/credits">
                <Credits/>
              </Route>
              <Route path="/world">
                <World />
              </Route>
            </Switch>
          </div>
        </UserContext.Provider>
      </Router>
    );
  }
}

export default App;
