const WebSocket = require("ws");
const User = require("./models/user");
const Blog = require("./models/blog");
const config = require('./config');

const WS_PORT = process.env.WS_PORT || config.wsPort;
const BLOGS_MAX_DISTANCE = config.blogsMaxDistance;
const BLOGS_LIMIT = config.blogsLimit;
const BLOGS_UPDATE_DISTANCE = Math.floor(Math.sqrt(((BLOGS_MAX_DISTANCE*2)**2)/2)/2);

let wss;
let connections = {};
let authentications = {};

const findUser = (userId) => {
  return User.findOne({ _id: userId }).then((user) => user);
};

const findBlogs = (position) => {
  return Blog.find({
    position: {
      $near: position,
      $maxDistance: BLOGS_MAX_DISTANCE
    }
  }).limit(BLOGS_LIMIT)
    .then((blogs) => {
      return User.populate(blogs, [{ path: "author" }]);
    })
    .then((blogs) => {
      return blogs.map((blog) => {
        blog.author.password = null;
        return blog;
      });
    });
};

const broadcastData = (self, data) => {
  if (wss) {
    wss.clients.forEach((client) => {
      if (client !== self && client.readyState === WebSocket.OPEN) {
        client.send(data);
      }
    });
  }
};

const socket = {
  initiateServer: () => {
    wss = new WebSocket.Server({ port: WS_PORT });
  },
  setupOnConnection: () => {
    if (wss) {
      wss.on("connection", function connection(ws) {
        ws.on("message", function message(data) {
          const stringData = data.toString();

          // On first connect, get user id, update connections obj, send back blogs
          if (stringData.startsWith("id:::")) {
            const userId = stringData.slice(5);

            // Authenticate the user, works in conjunction with authenticateConnection
            if (!authentications[userId]) {
              ws.close();
              return;
            }
            delete authentications[userId];
            
            ws.id = userId;
            findUser(ws.id)
              .then((user) => {
                connections[ws.id] = {
                  position: user.position,
                  lastPosition: user.position,
                };
                ws.send(`pos:::[${user.position[0]},${user.position[1]}]`);
                return findBlogs(user.position);
              })
              .then((blogs) => {
                ws.send("blogs:::" + JSON.stringify(blogs));
              })
              .catch((err) => {
                console.error(err);
              });
            broadcastData(ws, `peer:::${ws.id}`);
            return;
          }

          if (!ws.id) return;

          // On position update, update connection obj, check if need to re-send blogs
          if (stringData.startsWith("pos:::")) {
            const position = JSON.parse(stringData.slice(6));
            if (!isFinite(position[0]) || !isFinite(position[1])) {
              return;
            }

            connections[ws.id].position = position;
            const lastPosition = connections[ws.id].lastPosition;
            if (
              Math.abs(position[0] - lastPosition[0]) > BLOGS_UPDATE_DISTANCE || 
              Math.abs(position[1] - lastPosition[1]) > BLOGS_UPDATE_DISTANCE
            ) {
              findBlogs(position)
                .then((blogs) => {
                  ws.send("blogs:::" + JSON.stringify(blogs));
                  connections[ws.id].lastPosition = position;
                })
                .catch((err) => {
                  console.error(err);
                });
            }
            return;
          }
        });

        // On connection close, save users position to db
        ws.on("close", function close() {
          if (connections[ws.id]) {
            const position = connections[ws.id].position;
            User.updateOne({ _id: ws.id }, { $set: { position: position } }).catch(function(err) {
              console.error(err);
            });
            delete connections[ws.id];
          }
        });
      });
    }
  },
  pushAuthentication: (userId) => {
    authentications[userId] = true;
  },
  clearAuthentication: (userId) => {
    delete authentications[userId];
  },
};

module.exports = socket;