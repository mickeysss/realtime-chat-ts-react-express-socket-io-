const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Room = new Schema({
  roomId: { type: String, trim: true },
  roomName: { type: String, trim: true },
  userName: { type: String, trim: true },
});

module.exports = mongoose.model("rooms", Room);
