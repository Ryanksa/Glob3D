import React, { Suspense } from 'react';
import PropTypes from 'prop-types';
import './World.scss';
import Terrain from '../Terrain/Terrain';
import Character from '../Character/Character';

import { Canvas } from 'react-three-fiber';
import { Sky } from 'drei';
import { Physics } from 'use-cannon';
import { Vector3 } from 'three';

const World = () => (
  <Canvas className="World" >
    <ambientLight intensity={0.3} />
    <directionalLight castShadow position={[500, 1000, 250]} intensity={1.5} />
    <Sky distance={4500000000} sunPosition={new Vector3(500, 1000, 250)}/>

    <Physics gravity={[0, -100, 0]}>
      <Terrain />
      <Character />
    </Physics>
  </Canvas>
);

World.propTypes = {};

World.defaultProps = {};

export default World;
