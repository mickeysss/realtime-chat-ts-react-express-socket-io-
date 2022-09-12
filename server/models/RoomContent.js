const { model, Schema } = require("mongoose");

const roomContentSchema = new Schema({
  roomName: String,
  users: Array,
  messages:Array,
});

module.exports = model("roomsContent", roomContentSchema);

