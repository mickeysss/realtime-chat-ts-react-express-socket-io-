const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const mongoose = require("mongoose");


const PORT = 8002;
const app = require('./app')
const server = http.createServer(app);
const io = new Server(server);
const RoomsListModel = require("./models/Room.js");
const RoomsContentModel = require("./models/RoomContent.js");

const roomsDB = RoomsListModel;


mongoose
  .connect(
    "mongodb+srv://mikkk:qqq@cluster0.zkcpwmm.mongodb.net/example?retryWrites=true&w=majority"
  )
  .then(() => {
    console.log("hello MongoDB");
  });

const users = []

io.on("connection", (socket) => {
  console.log("a user connected", socket.id);

  socket.on("ROOM:JOIN", async ({ userName, roomObj }) => {
    const { roomName, roomId } = roomObj;
    socket.join(roomName);
    const room = await RoomsContentModel.find({roomName:roomName})
    users.push(userName)
    socket.broadcast.to(roomName).emit("ROOM:SET_USERS", users);
    if (roomId === userName) {
      const isAdmin = roomId === userName;
      socket.broadcast.to(roomName).emit("ROOM:ADMIN_ENTERED", isAdmin);
    }
  });
  //   const users = roomsDB.find(roomName).find(["users"]);
  //   console.log(users);
  //   socket.broadcast.to(roomName).emit("ROOM:SET_USERS", users);
  //   if (roomId === userName) {
  //     const isAdmin = roomId === userName;
  //     socket.broadcast.to(roomName).emit("ROOM:ADMIN_ENTERED", isAdmin);
  //   }
  // });

  // socket.on("ROOM:NEW_MESSAGE", ({ userName, roomName, text }) => {
  //   const obj = {
  //     userName,
  //     text,
  //   };
  //   console.log("obj", obj, roomName);
  //
  //   chatRoomDB.find(roomName).find(["messages"]).push(obj);
  //   socket.broadcast.to(roomName).emit("ROOM:NEW_MESSAGE", obj);
  // });
  //
  // socket.on("ROOM:DELETE_ADMIN", ({ roomObj }) => {
  //   const data = {
  //     deletedRemoved: true,
  //     roomObj: roomObj,
  //   };
  //
  //   if (roomObj) {
  //     roomsDB.deleteOne(roomObj.roomName);
  //
  //     socket.broadcast.to(roomObj.roomName).emit("ROOM:REMOVED", data);
  //   } else {
  //     return false;
  //   }
  // });

  // socket.on("disconnect", () => {
  //   roomsDB.find((value, roomName) => {
  //     if (value.find("users").delete(socket.id)) {
  //       const users = [...roomsDB.find(roomName).find(["users"])];
  //       socket.broadcast.to(roomName).emit("ROOM:SET_USERS", users);
  //     }
  //   });
  // });
});

server.listen(PORT, (err) => {
  if (err) {
    return new Error();
  }

  console.log("listening on *:8002");
});

