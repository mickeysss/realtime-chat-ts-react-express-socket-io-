const express = require("express");

const app = express();

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
const cors = require("cors");

app.use(bodyParser.json());
app.use(require("cors")());

app.use('/rooms', require('./routes/rooms'));

module.exports = app;
