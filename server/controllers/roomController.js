const mongoose = require('mongoose');
const RoomsListModel = require("../models/Room");
const RoomsContentModel = require("../models/RoomContent");
const MessageRoom = require("../models/MessageRoom");

// const rooms = new Map();
// const roomsArr = [];

exports.getAllRooms =  async(req, res) => {
  try {
    const rooms = await RoomsListModel.find().select(["roomName", "roomId"]);
    console.log('rooms',rooms)
    return res.json(rooms);
  } catch (err) {
    console.log(err);
  }
  const responseData = await RoomsListModel.find();
  res.json(responseData);
};

exports.createRoom = async (req, res) => {
  try{
    console.log('req.body',req.body);

    const { roomObj, userName } = req.body;

    console.log('roomObj,userName',roomObj,userName);

    const { roomName } = roomObj;

    let data = await RoomsListModel.find({roomName: roomName}).select(["roomName"]);
    console.log('data',data);

    if(!data.length){
       const responseData = await RoomsListModel.create({
        roomName: roomObj.roomName,
        roomId: roomObj.roomId,
      });
    }
  } catch (e) {
    console.log(e)
  }
  res.json('ok')

};

exports.getOneRoom =  async(req, res) => {
  const { id: roomName } = req.params;

  const RoomsContentModel = require("../models/RoomContent");


  const selectedRoomContent = await RoomsContentModel.findOne({roomName:roomName})
  const data = selectedRoomContent
    ?  await RoomsContentModel.findOne().select(["roomName","users", "messages"])
    :  await RoomsContentModel.create({
      roomName: roomName,
      users: [],
      messages: [],
    })

  res.status(200).json(data);

};

// exports.getRoom = (req, res) => {
//   const { id: roomName } = req.params;
//   const data = rooms.find(roomName)
//     ? {
//         users: [...rooms.get(roomName).get("users").values()],
//         messages: [...rooms.get(roomName).get("messages").values()],
//       }
//     : { users: [], messages: [] };
//
//   res.status(200).json(data);
// };

