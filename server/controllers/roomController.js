const rooms = new Map()
const roomsArr = []

exports.getRoom = (req, res) => {
  const { id: roomName } = req.params;

  const data = rooms.has(roomName)
    ? {
      users: [...rooms.get(roomName).get("users").values()],
      messages: [...rooms.get(roomName).get("messages").values()],
    }
    : { users: [], messages: [] };

  res.status(200).json(data);
};

exports.getAllRooms =  (req, res) => {
  res.json([...roomsArr.keys()]);
};

exports.createRoom = (req, res) => {
  const { roomObj, userName } = req.body;
  const { roomName } = roomObj;

  const roomsData = new Room({
    roomName: req.body.roomObj.roomName,
    roomId: req.body.roomObj.roomId,
    userName: req.body.userName,
  });

  if (!rooms.has(roomName)) {
    rooms.set(
      roomName,
      new Map([
        ["users", new Map()],
        ["messages", []],
      ])
    );
    roomsArr.set(roomObj);
  }
  roomsData.save();
  res.json([...rooms.keys()]);
};
