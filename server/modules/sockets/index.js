module.exports = (app) => {
  const http = require("http").Server(app);
  const io = require("socket.io")(http, {
    path: "/att"
  });

  io.on("connection", () => {
    console.log("Connection received");
  });
};
