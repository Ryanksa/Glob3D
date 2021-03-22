import React from 'react';
import PropTypes from 'prop-types';
import './Header.scss';

import { Link } from "react-router-dom";
import UserContext from '../../contexts/UserContext';

import logo from '../../assets/logo.svg';

const Header = () => (
  <header className="header">
    <a href="/" className="header-logo-link">
      <div className="header-logo"></div>
      <h1 className="header-title">Glob3D</h1>
    </a>
    <div className="header-nav-links">
      <Link className="header-link" to="/credits">Credits</Link>
      <UserContext.Consumer>
        {
          (context) => {
            if(Object.keys(context.user).length > 0) {
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

Header.propTypes = {};

Header.defaultProps = {};

export default Header;
