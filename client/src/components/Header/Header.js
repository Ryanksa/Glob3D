import React from 'react';
import PropTypes from 'prop-types';
import './Header.scss';

import logo from '../../logo.svg';

const Header = () => (
  <header className="Header">
    <img src={logo} className="App-logo" alt="logo" />
    <p>
      Edit <code>src/App.js</code> and save to reload.
    </p>
    <a
      className="App-link"
      href="https://reactjs.org"
      target="_blank"
      rel="noopener noreferrer"
    >
      Learn React
    </a>
  </header>
);

Header.propTypes = {};

Header.defaultProps = {};

export default Header;
