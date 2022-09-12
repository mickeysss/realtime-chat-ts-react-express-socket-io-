const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const MessageRoomSchema = new Schema({
  userName: { type: String, trim: true },
  text: { type: String, trim: true },
});

const MessageRoom = mongoose.model("MessageRoom", MessageRoomSchema);

module.exports = MessageRoom;
