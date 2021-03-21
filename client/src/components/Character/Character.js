import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import './Character.scss';
import Camera from './Camera';

import { useFrame, useThree } from 'react-three-fiber';
import { useSphere } from 'use-cannon';
import { Vector3 } from 'three';

// code for character movement and camera referenced from https://www.youtube.com/watch?v=Lc2JvBXMesY
const SPEED = 50;
const move = (key) => {
  switch(key) {
      case "KeyW":
          return "forward";
      case "KeyS":
          return "backward";
      case "KeyA":
          return "left";
      case "KeyD":
          return "right"
  }
}

const Character = (props) => {
  // character is a sphere
  const [ref, api] = useSphere(() => ({
    mass: 1,
    type: "Dynamic",
    position: [0, 0, 0],
    ...props
  }));
  // state to handle character movement
  const [movement, setMovement] = useState({
    forward: false,
    backward: false,
    left: false,
    right: false
  });
  const { camera } = useThree();
  const velocity = useRef([0, 0, 0]);

  useEffect(() => {
    // for y velocity
    api.velocity.subscribe(v => velocity.current = v);
    
    // movement handlers
    const handleKeyDown = (e) => {
      setMovement((m) => ({
          ...m,
          [move(e.code)]: true
      }));
    };
    const handleKeyUp = (e) => {
      setMovement((m) => ({
          ...m,
          [move(e.code)]: false
      }));
    };
    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("keyup", handleKeyUp);

    return (() => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("keyup", handleKeyUp);
    });
  }, []);

  useFrame(() => {
    // lock camera on first-person
    camera.position.copy(ref.current.position);

    // calculate character movement
    const frontVector = new Vector3(0, 0, movement.backward - movement.forward);
    const sideVector = new Vector3(movement.left - movement.right, 0, 0);
    const direction = new Vector3();
    direction.subVectors(frontVector, sideVector).normalize().multiplyScalar(SPEED).applyEuler(camera.rotation);
    // set velocity based on calculated movement
    api.velocity.set(direction.x, velocity.current[1], direction.z);
  });

  return (
    <>
      <Camera />
      <mesh ref={ref}>
        <sphereBufferGeometry attach="geometry" args={[1, 32, 32]} />
        <meshLambertMaterial attach="material" color="grey" />
      </mesh>
    </>
  );
};

Character.propTypes = {};

Character.defaultProps = {};

export default Character;
