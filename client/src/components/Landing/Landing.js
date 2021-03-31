import React, { Suspense } from 'react';
import PropTypes from 'prop-types';
import './Landing.scss';
import Planet from './Planet';

import { useHistory } from "react-router-dom";
import { Canvas } from 'react-three-fiber';
import { Html } from 'drei';

const Landing = (props) => {
  const history = useHistory();

  return <Canvas className="Landing">
    <ambientLight intensity={0.2} />
    <directionalLight position={[5, 10, 2.5]} intensity={1} />
    
    <Suspense fallback={null}>
      <Planet />
    </Suspense>

    <Html fullscreen>
      <div className="landing-text-container">
        <h2 className="landing-text-content">Explore our 3D open world blogging platform</h2>
        <button className="landing-text-button" onClick={() => history.push('/signup')}>
          Sign up to get started
        </button>
      </div>
    </Html>
  </Canvas>
};

Landing.propTypes = {};

Landing.defaultProps = {};

export default Landing;
