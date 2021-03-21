import './App.css';

import Header from './components/Header/Header';
import Login from './components/Login/Login';
import World from './components/World/World';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";

function App() {
  return (
    <Router>
      <div className="App">
        <Header/>
      </div>
      <Switch>
        <Route path="/login">
          <Login />
        </Route>
        <Route path="/world">
          <World />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
