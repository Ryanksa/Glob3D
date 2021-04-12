import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import './Blogs3D.scss';
import blog from '../../assets/blog3d.png';
import { useLoader } from 'react-three-fiber';
import { TextureLoader } from 'three';
import { fetchGraphql } from '../../utils/fetchService';
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
    const abortController = new AbortController();
    const signal = abortController.signal;

    // grab the user's initial position
    fetchGraphql(`
      query {
        getUserPosition
      }
    `, signal)
    .then((res) => res.json())
    .then((data) => {
      const pos = (data && data.data) ? data.data.getUserPosition : [0, 0];
      setInitPos([pos[0], 0, pos[1]]);
    })
    .catch((err) => {
      setInitPos([0, 0, 0]);
    });

    // long poll for a new set of blogs near the user
    (function updateBlogs(longPoll) {
      fetchGraphql(`
        query {
          blogsNearUser(limit: 20, long: ${longPoll}) {
            _id
            title
            content
            author {
              name
              email
            }
            date
            position
          }
        }
      `, signal)
      .then((res) => res.json())
      .then((data) => {
        const newBlogs = (data && data.data) ? data.data.blogsNearUser : null;
        if (newBlogs) setBlogs(newBlogs);
        updateBlogs(true);
      })
      .catch(() => {
        if (!signal.aborted) updateBlogs(true);
      });
    })(false);
    
    return () => {
      abortController.abort();
    }
  }, []);

  return (<>
    {initPos && 
    <Character initPos={initPos} blogs={blogs} 
              updateInterface={props.updateInterface}/>}
    
    {blogs.map((blog) => (
      <Blog key={blog._id} position={[blog.position[0], 0, blog.position[1]]} />
    ))}
  </>);
};

Blogs3D.propTypes = {};

Blogs3D.defaultProps = {};

export default Blogs3D;
