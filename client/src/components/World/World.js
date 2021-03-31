import React, { Suspense, useState } from 'react';
import PropTypes from 'prop-types';
import './World.scss';
import Terrain from '../Terrain/Terrain';
import Interface from '../Interface/Interface';
import Blogs3D from '../Blogs3D/Blogs3D';

import { Canvas } from 'react-three-fiber';
import { Sky } from 'drei';
import { Physics } from 'use-cannon';
import { Vector3 } from 'three';

const World = () => {
  const [blogTitle, setBlogTitle] = useState("");
  const [blogAuthor, setBlogAuthor] = useState("");
  const updateInterface = (title, author) => {
    if (blogTitle !== title) setBlogTitle(title);
    if (blogAuthor !== author) setBlogAuthor(author);
  };

  return(<>
    <Interface blogTitle={blogTitle} blogAuthor={blogAuthor}/>
    <Canvas className="World" >
      <Suspense fallback={null}>
        <ambientLight intensity={0.3} />
        <directionalLight castShadow position={[500, 1000, 250]} intensity={1.5} />
        <Sky distance={4500000000} sunPosition={new Vector3(500, 1000, 250)}/>

        <Physics gravity={[0, -100, 0]}>
          <Terrain />
          <Blogs3D updateInterface={updateInterface}/>
        </Physics>
      </Suspense>
    </Canvas>
  </>);
};

World.propTypes = {};

World.defaultProps = {};

export default World;
