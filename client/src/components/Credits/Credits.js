import React from 'react';
import PropTypes from 'prop-types';
import './Credits.scss';

const Credits = () => (
  <div className="credits-wrapper">
    <h1>Credits</h1>
    <div className="credits-list-container">
      <ul>
        <li>Material UI found <a href="https://material-ui.com/">here</a></li>
        <li>Icons made by <a href="https://www.flaticon.com/authors/turkkub" title="turkkub">turkkub</a> from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a></li>
        <li>3D model <a href="https://skfb.ly/6QSnP">Low poly assets</a> made by premudraya is licensed under <a href="http://creativecommons.org/licenses/by/4.0/">Creative Commons Attribution</a>.</li>
        <li>3D model <a href="https://skfb.ly/6SGGt">Low Poly Grass Pack</a> made by Anskar is licensed under <a href="http://creativecommons.org/licenses/by/4.0/">Creative Commons Attribution</a>.</li>        
        <li>3D model <a href="https://skfb.ly/6UrTV">Low poly Tree Trunk</a> made by Anskar is licensed under <a href="http://creativecommons.org/licenses/by/4.0/">Creative Commons Attribution</a>.</li>
        <li>3D model <a href="https://skfb.ly/6WWZQ">Low poly Cliff</a> made by Anskar is licensed under <a href="http://creativecommons.org/licenses/by/4.0/">Creative Commons Attribution</a>.</li>
        <li>3D model <a href="https://skfb.ly/6WtsA">Low Poly Flowers</a> made by Anskar is licensed under <a href="http://creativecommons.org/licenses/by/4.0/">Creative Commons Attribution</a>.</li>
      </ul>
    </div>
  </div>
);

Credits.propTypes = {};

Credits.defaultProps = {};

export default Credits;
