const mongoose = require("moongoose");
const keys = require("./config");

mongoose
  .connect(keys.mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("MongoDB created");
    console.log(keys.mongoURI);
  })
  .catch((e) => console.log(e));

require('./models/Room');
require('./models/MessageRoom');

const PORT = 8002;
const http = require("http");
const app = require('./app');
const server = http.createServer(app);
server.listen(PORT, (err) => {
  if (err) {
    return new Error();
  }
  console.log("listening on *:8002");
});

const rooms = new Map();
const roomsArr = new Map();
const { Server } = require("socket.io");
const io = new Server(server);
io.on("connection", (socket) => {
  console.log("a user connected", socket.id);

  socket.on("ROOM:JOIN", ({ userName, roomObj }) => {
    const { roomName, roomId } = roomObj;
    socket.join(roomName);
    rooms.get(roomName).get("users").set(socket.id, userName);
    const users = [...rooms.get(roomName).get("users").values()];
    socket.broadcast.to(roomName).emit("ROOM:SET_USERS", users);
    if (roomId === userName) {
      const isAdmin = roomId === userName;
      socket.broadcast.to(roomName).emit("ROOM:ADMIN_ENTERED", isAdmin);
    }
  });

  socket.on("ROOM:NEW_MESSAGE", ({ userName, roomName, text }) => {
    const obj = {
      userName,
      text,
    };
    console.log("obj", obj, roomName);

    rooms.get(roomName).get("messages").push(obj);
    socket.broadcast.to(roomName).emit("ROOM:NEW_MESSAGE", obj);
  });

  socket.on("ROOM:DELETE_ADMIN", ({ roomName }) => {
    const deleteRemoved = true;
    socket.broadcast.to(roomName).emit("ROOM:REMOVED", deleteRemoved);
  });

  socket.on("disconnect", () => {
    rooms.forEach((value, roomName) => {
      if (value.get("users").delete(socket.id)) {
        const users = [...rooms.get(roomName).get("users").values()];
        socket.broadcast.to(roomName).emit("ROOM:SET_USERS", users);
      }
    });
  });
});

console.log(rooms.keys());

