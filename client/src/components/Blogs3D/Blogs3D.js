import React from 'react';
import './Blogs3D.scss';
import blog from '../../assets/blog3d.png';
import { useLoader } from 'react-three-fiber';
import { TextureLoader } from 'three';

const Blog = (props) => {
  const texture = useLoader(TextureLoader, blog);
  return(
    <group position={props.position}>
      <mesh position={[0, 0.1, 0]} rotation={[-Math.PI/2, 0, 0]} >
        <planeBufferGeometry attach="geometry" args={[1, 1]} />
        <meshLambertMaterial attach="material" map={texture} />
      </mesh>
    </group>
  );
}

const Blogs3D = (props) => {
  return (
    <>
      {props.blogs.map((blog) => (
        <Blog key={blog._id} position={[blog.position[0], 0, blog.position[1]]} />
      ))}
    </>
  );
};

export default Blogs3D;
