const app = require("./app")

const port = process.env.PORT;

// ------------------------------------------------
app.listen(port, () => {
  console.log("server is up and running on port " + port);
});

// const Task = require("./models/task")
// const User = require("./models/user")
// const multer = require("multer")

// const main = async () => {

//   // fetch the owner from a task
//   const task = await Task.findById("5e880617ac8d313a2dc6aead")
//   await task.populate('owner').execPopulate()
//   console.log(task.owner)

//   // // fetch all the task that user owns
//   const user = await User.findById("5e88060fac8d313a2dc6aeab")
//   await user.populate("tasks").execPopulate()
//   console.log(user.tasks)

// }
// main()