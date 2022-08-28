const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const PORT = 8002;
const rooms = new Map();
let roomsArr = [];

app.use(cors());
app.use(express.json());

app.get("/rooms/:id", (req, res) => {
  const { id: roomName } = req.params;

  const data = rooms.has(roomName)
    ? {
        users: [...rooms.get(roomName).get("users").values()],
        messages: [...rooms.get(roomName).get("messages").values()],
      }
    : { users: [], messages: [] };

  res.status(200).json(data);
});

app.get("/rooms", (req, res) => {
  res.json(roomsArr);
  console.log(roomsArr);
});

app.post("/rooms", (req, res) => {
  const { roomObj, userName } = req.body;
  const { roomName } = roomObj;

  if (!rooms.has(roomName)) {
    rooms.set(
      roomName,
      new Map([
        ["users", new Map()],
        ["messages", []],
      ])
    );
    roomsArr.push(roomObj);
  }

  res.json([...rooms.keys()]);
});

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

  socket.on("ROOM:DELETE_ADMIN", ({ roomObj }) => {
    const data = {
      deletedRemoved: true,
      roomObj: roomObj,
    };

    if (roomObj) {
      const checkRoom = roomsArr.filter(
        (room) => room.roomName === roomObj.roomName
      );
      const updatedRooms = roomsArr.filter(
        (room) => room.roomName !== roomObj.roomName
      );

      if (!!checkRoom) {
        roomsArr = updatedRooms;
      }
      console.log("removednew arr", roomsArr);
      socket.broadcast.to(roomObj.roomName).emit("ROOM:REMOVED", data);
    } else {
      return false;
    }
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

server.listen(PORT, (err) => {
  if (err) {
    return new Error();
  }

  console.log("listening on *:8002");
});
