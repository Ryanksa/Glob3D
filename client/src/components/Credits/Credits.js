import React from 'react';
import PropTypes from 'prop-types';
import './Credits.scss';

const Credits = () => (
  <div className="credits-wrapper">
    <h1>Credits</h1>
    <ul>
      <li>Material UI found <a href="https://material-ui.com/">here</a></li>
      <li>Icons made by <a href="https://www.flaticon.com/authors/turkkub" title="turkkub">turkkub</a> from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a></li>
    </ul>
  </div>
);

Credits.propTypes = {};

Credits.defaultProps = {};

export default Credits;
