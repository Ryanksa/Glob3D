import React from 'react';
import './Header.scss';

import { isLoggedIn } from '../../utils/auth';
import { Link } from "react-router-dom";
import UserContext from '../../contexts/userContext';

const Header = () => (
  <header className="header">
    <Link className="header-logo-link" to="/">
      <div className="header-logo"></div>
      <h1 className="header-title">Glob3D</h1>
    </Link>
    <div className="header-nav-links">
      <Link className="header-link" to="/credits">Credits</Link>
      <UserContext.Consumer>
        {
          (context) => {
            if(isLoggedIn(context.user)) {
              return <Link className="header-link" to="/signout">Signout</Link>
            } else {
              return (
                <>
                  <Link className="header-link" to="/signup">Signup</Link>
                  <Link className="header-link" to="/login">Login</Link>
                </>
              );
            }
          }
        }
      </UserContext.Consumer>
    </div>
  </header>
);

export default Header;
