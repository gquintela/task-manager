const express = require("express");
require("./db/mongoose");
const userRouter = require("./routers/user");
const taskRouter = require("./routers/task");

const app = express();

app.use(express.json()); /// parse incoming as json into an object
app.use(userRouter);
app.use(taskRouter);
app.use(express.static(__dirname));

app.get("/", (req, res) => {
    res.send()
});

module.exports = app