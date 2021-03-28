import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import './Blogs3D.scss';
import blog from '../../assets/blog3d.png';
import { useLoader } from 'react-three-fiber';
import { TextureLoader } from 'three';
import { fetchGraphql } from '../../fetchService';
import Character from '../Character/Character';

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
  const [blogs, setBlogs] = useState([]);
  const [initPos, setInitPos] = useState(null);

  useEffect(() => {
    // grab the user's initial position
    fetchGraphql(`
      query {
        getUserPosition
      }
    `)
    .then((res) => res.json())
    .then((data) => {
      const pos = (data && data.data) ? data.data.getUserPosition : [0, 0, 0];
      setInitPos([pos[0], 0, pos[1]]);
    });

    // poll every 6 secs for a new set of blogs around the user
    const updateBlogs = () => {
      fetchGraphql(`
        query {
          blogsNearUser(limit: 20) {
            _id
            title
            content
            author {
              name
              email
            }
            date
            x
            z
          }
        }
      `)
      .then((res) => res.json())
      .then((data) => {
        const newBlogs = (data && data.data) ? data.data.blogsNearUser : [];
        setBlogs(newBlogs);
      });
    }
    updateBlogs();
    setInterval(updateBlogs, 6000);
    
    return () => {
      clearInterval(updateBlogs);
    }
  }, []);

  return (<>
    {initPos && <Character initPos={initPos} blogs={blogs} updateInterface={props.updateInterface}/>}
    {blogs.map((blog) => (
      <Blog position={[blog.x, 0, blog.z]} />
    ))}
  </>);
};

Blogs3D.propTypes = {};

Blogs3D.defaultProps = {};

export default Blogs3D;
