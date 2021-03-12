import React from 'react';
import PropTypes from 'prop-types';
import './Header.scss';

import { Link } from "react-router-dom";

import logo from '../../logo.svg';

const Header = () => (
  <header className="Header">
    <Link to="/login">Login</Link>
  </header>
);

Header.propTypes = {};

Header.defaultProps = {};

export default Header;
