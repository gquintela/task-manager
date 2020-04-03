const express = require("express");
require("./db/mongoose");
const userRouter = require("./routers/user");
const taskRouter = require("./routers/task");


const app = express();
const port = process.env.PORT || 3000;




app.use(express.json()); /// parse incoming as json into an object
app.use(userRouter);
app.use(taskRouter);

// ------------------------------------------------
app.listen(port, () => {
  console.log("server is up and running on port " + port);
});