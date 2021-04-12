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
import ReadBlogScreen from './components/ReadBlogScreen/ReadBlogScreen';
import WriteBlogScreen from './components/WriteBlogScreen/WriteBlogScreen';

import React from 'react';
import UserContext from './contexts/userContext';


const SESSION_USER_KEY = `GLOB3D_USER`;

class App extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      user: {},
      errors: []
    };
    
    this.updateUser = this.updateUser.bind(this);
    this.handleError = this.handleError.bind(this);
    this.removeError = this.removeError.bind(this);
  }

  componentDidMount() {
    // attempt to restore user session
    try {
      const savedUser = JSON.parse(localStorage.getItem(SESSION_USER_KEY));
      if('email' in savedUser && 'name' in savedUser && '_id' in savedUser) this.setState({ user: savedUser });
    } catch(e) {
      localStorage.setItem(SESSION_USER_KEY, JSON.stringify({}));
    }
  }

  updateUser(user) {
    this.setState({
      user: user
    });
    localStorage.setItem(SESSION_USER_KEY, JSON.stringify(user));
  }

  handleError(error) {
    this.setState({
      errors: [...this.state.errors, error]
    });
  }

  removeError(error) {
    // https://stackoverflow.com/a/44433050
    const newErrors = [...this.state.errors];
    newErrors.splice(this.state.errors.indexOf(error), 1)

    this.setState({
      errors: newErrors
    });
  }

  render() {
    // define context bundle to pass down to children
    const context = {
      user: this.state.user,
      errors: this.state.errors,
      updateUser: this.updateUser,
      handleError: this.handleError,
      removeError: this.removeError
    };

    return (
      <Router>
        <UserContext.Provider value={context}>
          <div className="App">
            <Header/>
            <Error />
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
              <Route exact path="/blogscreen">
                <WriteBlogScreen/>
              </Route>
              <Route exact path="/blogscreen/">
                <WriteBlogScreen/>
              </Route>
              <Route path="/blogscreen/:id" component={ReadBlogScreen} />
            </Switch>
          </div>
        </UserContext.Provider>
      </Router>
    );
  }
}

export default App;
