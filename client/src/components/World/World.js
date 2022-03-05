import React, { Suspense, useState, useContext, useEffect } from "react";
import "./World.scss";
import Terrain from "../Terrain/Terrain";
import Interface from "../Interface/Interface";
import Blogs3D from "../Blogs3D/Blogs3D";
import Character from '../Character/Character';
import Peer from '../Peer/Peer';
import UserContext from "../../contexts/userContext";
import { isLoggedIn } from "../../utils/auth";
import websocket from "../../utils/websocket";
import webrtc from "../../utils/webrtc";
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
  // state to keep track of concurrent users' positions
  const [peerPositions, setPeerPositions] = useState({});

  useEffect(() => {
    if (context && context.user && context.user._id) {
      // Setup peer-to-peer connection to update each other's position
      const peerDataCallback = (peerId, data) => {
        if (data.startsWith("pos:::")) {
          const pos = JSON.parse(data.slice(6));
          setPeerPositions((positions) => ({
            ...positions,
            [peerId]: pos,
          }));
        }
      };
      const peerCloseCallback = (peerId) => {
        setPeerPositions((positions) => {
          delete positions[peerId];
          return {...positions};
        });
      };
      webrtc.setupConnection(context.user._id, peerDataCallback, peerCloseCallback);

      // Connect to server's websocket to write user position and read blogs
      fetchGraphql(`
        query {
          authenticateConnection
        }
      `).then(() => {
        websocket.setupConnection(context.user._id, (event) => {
          const data = event.data;
          if (data.startsWith("pos:::")) {
            const pos = JSON.parse(data.slice(6));
            setInitPos([pos[0], 0, pos[1]]);
          } else if (data.startsWith("blogs:::")) {
            const blogs = JSON.parse(data.slice(8));
            setBlogs(blogs);
          } else if (data.startsWith("peer:::")) {
            const peerId = data.slice(7);
            webrtc.connectToPeer(context.user._id, peerId, peerDataCallback, peerCloseCallback);
          }
        });
      });
    }

    return () => {
      webrtc.closeConnection();
      websocket.closeConnection();
    }
  }, [context, context.user, context.user._id]);

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

  const updateInterface = (title, author) => {
    if (blogTitle !== title) setBlogTitle(title);
    if (blogAuthor !== author) setBlogAuthor(author);
  };

  if (!isLoggedIn(context.user)) return <></>;
  return (
    <div id="world">
      <Interface blogTitle={blogTitle} blogAuthor={blogAuthor} />
      <Canvas className="WorldCanvas">
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

          <Physics gravity={[0, -1000, 0]}>
            <Terrain />
            <Blogs3D blogs={blogs} />
            {initPos &&
              <Character initPos={initPos} blogs={blogs} updateInterface={updateInterface} />
            }
            {peerPositions &&
              Object.keys(peerPositions).map((peerId) => (
                <Peer 
                  x={peerPositions[peerId][0]}
                  y={0}
                  z={peerPositions[peerId][1]}
                />
              ))
            }
          </Physics>
        </Suspense>
      </Canvas>
    </div>
  );
};

export default World;
