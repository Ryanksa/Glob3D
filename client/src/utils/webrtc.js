import Peer from 'peerjs';

let peer;
let peerConnections = {};

const webrtc = {
  setupConnection: (userId, dataCallback, closeCallback) => {
    peer = new Peer(userId);
    peer.on("connection", (conn) => {
      conn.on("data", (data) => {
        dataCallback(conn.metadata.id, data);
      });
      conn.on("close", () => {
        delete peerConnections[conn.metadata.id];
        closeCallback(conn.metadata.id);
      });
      peerConnections[conn.metadata.id] = conn;
    });
  },
  connectToPeer: (userId, peerId, dataCallback, closeCallback) => {
    if (peer) {
      const conn = peer.connect(peerId, { metadata: { id: userId } });
      conn.on("data", (data) => {
        dataCallback(conn.metadata.id, data);
      });
      conn.on("close", () => {
        delete peerConnections[conn.metadata.id];
        closeCallback(conn.metadata.id);
      });
      peerConnections[peerId] = conn;
    }
  },
  broadcastData: (data) => {
    Object.values(peerConnections).forEach((conn) => {
      conn.send(data);
    });
  },
  closeConnection: () => {
    if (peer) {
      peer.destroy();
      peer = null;
      peerConnections = {};
    }
  }
};

export default webrtc;