import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import './Character.scss';
import Camera from './Camera';
import { fetchGraphql } from '../../fetchService';

import { useFrame, useThree } from 'react-three-fiber';
import { useSphere } from 'use-cannon';
import { Vector3 } from 'three';

// code for character movement and camera referenced from https://www.youtube.com/watch?v=Lc2JvBXMesY
const SPEED = 30;
const move = (key) => {
  switch(key) {
      case "KeyW":
          return "forward";
      case "KeyS":
          return "backward";
      case "KeyA":
          return "left";
      case "KeyD":
          return "right";
  }
}
const getXZ = (position) => {
  const x = Math.round(position.x);
  const z = Math.round(position.z);
  return [x, z];
} 

const Character = (props) => {
  // character is a sphere
  const [ref, api] = useSphere(() => ({
    mass: 1,
    type: "Dynamic",
    position: props.initPos
  }));
  // state to handle character movement
  const [movement, setMovement] = useState({
    forward: false,
    backward: false,
    left: false,
    right: false
  });
  const { camera } = useThree();

  useEffect(() => {
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
      // spacebar to interact with blogs
      if (e.code === "Space") {
        const [x, z] = getXZ(camera.position);
        const onBlog = props.blogs.find(blog => (blog.x === x && blog.z === z));
        if (onBlog) {
          console.log(onBlog);
        }
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("keyup", handleKeyUp);

    // update backend with user's new position every 3 secs
    let timeout;
    const updatePos = (x, z) => {
      const [new_x, new_z] = getXZ(camera.position);
      if (new_x !== x || new_z !== z) {
        fetchGraphql(`
          mutation {
            updateUserPosition(position: [${Math.round(new_x)}, ${Math.round(new_z)}])
          }
        `);
      }
      timeout = setTimeout(() => updatePos(new_x, new_z), 3000);
    };
    timeout = setTimeout(() => updatePos(ref.current.position.x, ref.current.position.z), 3000);

    return (() => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("keyup", handleKeyUp);
      clearTimeout(timeout);
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
    api.velocity.set(direction.x, 0, direction.z);

    // update interface based on user's current position
    const [x, z] = getXZ(camera.position);
    const blog = props.blogs.find(blog => (blog.x === x && blog.z === z));
    if (blog) {
      props.updateInterface(blog.title, blog.author.name)
    } else {
      props.updateInterface("", "");
    }
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
