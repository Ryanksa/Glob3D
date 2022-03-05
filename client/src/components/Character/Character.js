import React, { useEffect, useState, useRef, memo } from 'react';
import Camera from './Camera';
import websocket from '../../utils/websocket';
import webrtc from '../../utils/webrtc';

import { useFrame, useThree } from 'react-three-fiber';
import { useSphere } from 'use-cannon';
import { Vector3 } from 'three';

// code for character movement adapted from https://www.youtube.com/watch?v=Lc2JvBXMesY
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
      default:
        break;
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
    mass: 0.5,
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
  const blogId = useRef(null);

  useEffect(() => {
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
      if (e.code === "Space" && blogId.current) {
        window.location.replace(`/blog/${blogId.current}`);
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("keyup", handleKeyUp);

    const posUpdateInterval = setInterval(() => {
      if (camera && camera.position) {
        const [x, z] = getXZ(camera.position);
        const posData = `pos:::[${x},${z}]`;
        websocket.sendData(posData);
        webrtc.broadcastData(posData);
      }
    }, 500);
    
    return (() => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("keyup", handleKeyUp);
      clearInterval(posUpdateInterval);
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
    const blog = props.blogs.find(blog => (blog.position[0] === x && blog.position[1] === z));
    if (blog) {
      if (blogId.current !== blog._id) blogId.current = blog._id;
      props.updateInterface(blog.title, blog.author.name);
    } else {
      if (blogId.current) blogId.current = null;
      props.updateInterface("", "");
    }
  });

  return (
    <>
      <Camera />
      <mesh ref={ref}>
        <sphereBufferGeometry attach="geometry" args={[0.5, 32, 32]} />
        <meshLambertMaterial attach="material" color="lavender" />
      </mesh>
    </>
  );
};

export default memo(Character);
