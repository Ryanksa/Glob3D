let socket;

module.exports = {
  setupConnection: (user_id, messageCallback) => {
    socket = new WebSocket(process.env.REACT_APP_WS_URL);
    socket.addEventListener("open", (event) => {
      socket.send("id:::" + user_id);
    });
    socket.addEventListener("message", (event) => {
      messageCallback(event);
    });
  },
  sendData: (data) => {
    if (socket) {
      socket.send(data);
    }
  },
  closeConnection: () => {
    if (socket) {
      socket.close();
    }
  },
};