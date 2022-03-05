import React, { Suspense, useState, useContext, useEffect } from "react";
import "./World.scss";
import Terrain from "../Terrain/Terrain";
import Interface from "../Interface/Interface";
import Blogs3D from "../Blogs3D/Blogs3D";
import Character from '../Character/Character';
import UserContext from "../../contexts/userContext";
import { isLoggedIn } from "../../utils/auth";
import { setupConnection, closeConnection } from "../../utils/websocket";
import { fetchGraphql } from "../../utils/fetchService";

import { Canvas } from "react-three-fiber";
import { Sky } from "drei";
import { Physics } from "use-cannon";
import { Vector3 } from "three";

const World = () => {
  const context = useContext(UserContext);
  // state to store all the blogs near the user
  const [blogs, setBlogs] = useState([]);
  const [initPos, setInitPos] = useState(null);
  // states to update Interface with the blog user is walking over
  const [blogTitle, setBlogTitle] = useState("");
  const [blogAuthor, setBlogAuthor] = useState("");

  useEffect(() => {
    // Setup long polling to be notified when other users create blogs
    const abortController = new AbortController();
    const signal = abortController.signal;
    (function updateBlogs(longPoll) {
      fetchGraphql(`
        query {
          blogsNearUser(limit: 100, long: ${longPoll}) {
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
      .then(({ data }) => {
        const newBlogs = data ? data.blogsNearUser : null;
        if (newBlogs) setBlogs(newBlogs);
        updateBlogs(true);
      })
      .catch(() => {
        if (!signal.aborted) updateBlogs(true);
      });
    })(true);

    return () => {
      abortController.abort();
    };
  }, []);

  useEffect(() => {
    if (context && context.user && context.user._id) {
      // Connect to server websocket to write user position and read blogs
      fetchGraphql(`
        query {
          authenticateConnection
        }
      `).then(() => {
        setupConnection(context.user._id, (event) => {
          const data = event.data;

          if (data.startsWith("pos:::")) {
            const pos = data.slice(6).split(",");
            setInitPos([+pos[0], 0, +pos[1]]);
          }

          if (data.startsWith("blogs:::")) {
            const blogs = JSON.parse(data.slice(8));
            setBlogs(blogs);
          }
        });
      });
    }

    return () => {
      closeConnection();
    }
  }, [context, context.user, context.user._id]);

  const updateInterface = (title, author) => {
    if (blogTitle !== title) setBlogTitle(title);
    if (blogAuthor !== author) setBlogAuthor(author);
  };

  if (!isLoggedIn(context.user)) return <></>;
  return (
    <div id="world">
      <Interface blogTitle={blogTitle} blogAuthor={blogAuthor} />
      <Canvas className="World">
        <Suspense fallback={null}>
          <ambientLight intensity={0.3} />
          <directionalLight
            castShadow
            position={[500, 1000, 250]}
            intensity={1.5}
          />
          <Sky
            distance={4500000000}
            sunPosition={new Vector3(500, 1000, 250)}
          />

          <Physics gravity={[0, -100, 0]}>
            <Terrain />
            <Blogs3D blogs={blogs} />
            {initPos &&
              <Character initPos={initPos} blogs={blogs} updateInterface={updateInterface} />
            }
          </Physics>
        </Suspense>
      </Canvas>
    </div>
  );
};

export default World;
