const router = require("express").Router();
const roomController = require("../controllers/roomController");

router.get("/", roomController.getAllRooms);
router.post("/", roomController.createRoom);
router.get("/:id", roomController.getOneRoom);

module.exports = router;
