import React from 'react';
import { useFrame } from 'react-three-fiber';
import { useSphere } from 'use-cannon';

const Peer = (props) => {
  const [ref, api] = useSphere(() => ({
    mass: 1,
    type: "Dynamic",
    position: [props.x, props.y, props.z]
  }));

  useFrame(() => {
    api.position.set(props.x, props.y, props.z);
  });

  return (
    <mesh ref={ref}>
      <sphereBufferGeometry attach="geometry" args={[0.5, 32, 32]} />
      <meshLambertMaterial attach="material" color="lavender" />
    </mesh>
  );
};

export default Peer;
