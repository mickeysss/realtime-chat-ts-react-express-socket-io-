const router = require('express').Router();
const roomController = require('../controllers/roomController');

router.get('/rooms', roomController.getAllRooms);
router.post('/rooms', roomController.createRoom);
router.get('/rooms:id', roomController.getRoom);
// router.delete('/rooms:id', roomController.removeRoom);

module.exports = router;
