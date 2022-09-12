const { model, Schema } = require("mongoose");

const roomSchema = new Schema({
    roomName: String,
    roomId: String,
    userName: String,
});

module.exports = model("rooms", roomSchema);

