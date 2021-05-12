import React, { Suspense, useContext } from 'react';
import './Landing.scss';
import Planet from './Planet';

import UserContext from '../../contexts/userContext';

import { isLoggedIn } from '../../utils/auth';
import { useHistory } from "react-router-dom";
import { Canvas } from 'react-three-fiber';
import { Html } from 'drei';

const Landing = (props) => {
  const history = useHistory();
  const context = useContext(UserContext);

  return <Canvas className="Landing">
    <ambientLight intensity={0.2} />
    <directionalLight position={[5, 10, 2.5]} intensity={1} />
    
    <Suspense fallback={null}>
      <Planet />
    </Suspense>

    <Html fullscreen>
      <div className="landing-text-container">
        <h2 className="landing-text-content">Explore our 3D open world blogging platform</h2>
        { 
          isLoggedIn(context.user) ?
            <button className="landing-text-button" onClick={() => history.push('/world')}>
              Go to world!
            </button> 
            :
            <>
              <button className="landing-text-button" onClick={() => history.push('/signup')}>
                Sign up to get started
              </button>
              <button className="landing-text-button" onClick={() => history.push('/login')}>
                Login
              </button>
            </>
        }
      </div>
    </Html>
  </Canvas>
};

export default Landing;
