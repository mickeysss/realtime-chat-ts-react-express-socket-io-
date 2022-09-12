const express = require("express");
const app = express();
const cors = require("cors");


app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

console.log('hello app')
const RoomsListModel = require("./models/Room.js");

app.use("/rooms", require("./routes/rooms"));
//
// app.get("/rooms/:id", (req, res) => {
//   const { id: roomName } = req.params;
//   const dataDB = roomsDB.find(roomName)
//     ? {
//       users: [...chatRoomDB.find(roomName).find(["users"])],
//       messages: [...chatRoomDB.find(roomName).find(["messages"])],
//     }
//     : { users: [], messages: [] };
//
//   res.status(200).json(dataDB);
// });
//
// app.get("/rooms", async (req, res) => {
//   try {
//     const rooms = await RoomsListModel.find().select(["roomName", "roomId"]);
//     console.log(rooms)
//     return res.json(rooms);
//   } catch (err) {
//     console.log(err);
//   }
//   const responseData = await RoomsListModel.find();
//   res.json(responseData);
//   console.log(responseData);
// });
//
// app.post("/rooms", async (req, res) => {
//   const { roomObj, userName } = req.body;
//   const { roomName } = roomObj;
//   let data = await RoomsListModel.find({ roomName: roomName });
//   if (!data) {
//     await ChatRoomModel.create({
//       roomName: roomObj.roomName,
//       users: [],
//       messages: [],
//     });
//     await RoomsListModel.create({
//       roomName: roomObj.roomName,
//       roomId: roomObj.roomId,
//     });
//   }
//
//   res.json({
//     roomName: roomObj.roomName,
//     roomId: roomObj.roomId,
//   });
//   console.log(roomObj);
// });
//
//
module.exports = app;
