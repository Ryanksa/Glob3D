import React, { useContext, useState, Suspense } from 'react';
import './Landing.scss';
import worldExampleGif from '../../assets/glob3d-world.gif';
import blogExampleGif from '../../assets/glob3d-blog.gif';
import logo from '../../assets/logo.svg';

import UserContext from '../../contexts/userContext';

import { isLoggedIn } from '../../utils/auth';
import { useHistory } from "react-router-dom";

const Landing = (props) => {
  const history = useHistory();
  const context = useContext(UserContext);
  const [slide, setSlide] = useState(1);

  return(
    <div className="Landing">
      <div className="slides">
        <div id="slide1" className="slide-container">
          <img src={worldExampleGif} alt="" />
          <h2 className="slide1-content">Explore our 3D open world blogging platform</h2>
        </div>

        <div id="slide2" className="slide-container">
          <img src={blogExampleGif} alt="" />
          <h2 className="slide2-content">Leave a blog in the world</h2>
        </div>

        <div id="slide3" className="slide-container">
          <div className="slide3-content-container">
            <img src={logo} alt="" />
            <h2 className="slide3-content">Sign up or log in to get started</h2>
          </div>
          { 
            isLoggedIn(context.user) ?
              <button className="slide3-button" onClick={() => history.push('/world')}>
                Go to world!
              </button> 
              :
              <div>
                <button className="slide3-button" onClick={() => history.push('/signup')}>
                  Sign up
                </button>
                <button className="slide3-button" onClick={() => history.push('/login')}>
                  Login
                </button>
              </div>
          }
        </div>
      </div>

      <div className="slider-buttons">
        <a href="#slide1" className={slide === 1 ? "selected-button" : ""} 
            onClick={() => setSlide(1)} />
        <a href="#slide2" className={slide === 2 ? "selected-button" : ""}
            onClick={() => setSlide(2)} />
        <a href="#slide3" className={slide === 3 ? "selected-button" : ""}
            onClick={() => setSlide(3)} />
      </div>
    </div>

  );
};

export default Landing;
