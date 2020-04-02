const express = require("express");
require("./db/mongoose");
const User = require("./models/user");
const Task = require("./models/task");
const parsedId = require("./utils/utils");

const app = express();

const port = process.env.PORT || 3000;

app.use(express.json()); /// parse incoming as json into an object

// USERS METHOD-------------------------------------------
//create new user
app.post("/users", async (req, res) => {
  const user = new User(req.body);
  try {
    await user.save();
    res.status(201).send(user);
    console.log("User " + user.name + " created.");
  } catch (error) {
    res.status(400).send(error.message);
  }
});

///get all users
app.get("/users", async (req, res) => {
  try {
    const users = await User.find({});
    res.send(users);
  } catch (error) {
    res.status(500).send(error);
  }
});

///get user by ID
app.get("/users/:id", async (req, res) => {
  debugger;
  let _parsedId = parsedId(req.params.id);
  if (_parsedId.length > 24) {
    return res.status(400).send("error, mismatch of id length");
  }
  try {
    debugger;
    const user = await User.findById(_parsedId);
    if (!user) {
      res.status(404).send();
    } else {
      res.send(user);
    }
  } catch (error) {
    res.status(500).send();
  }
});

app.patch("/users/:id"),
  async (req, res) => {
    try {
      const user = await User.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
      });
      if (!user) {
        return res.status(404).send();
      }
      res.send(user);
    } catch (error) {
      res.status(400).send();
    }
  };

// tasks methods----------------------------------------
///write new task
app.post("/tasks", async (req, res) => {
  const task = new Task(req.body);

  try {
    await task.save();
    res.status(201).send(task);
    console.log('New task "' + task.description + '" created.');
  } catch (error) {
    res.status(400).send(error.message);
  }
});

///get all tasks
app.get("/tasks", async (req, res) => {
  try {
    const tasks = await Task.find({});
    res.send(tasks);
    console.log("all tasks fetched");
  } catch (error) {
    res.status(500).send();
  }
});

/// get task by id
app.get("/tasks/:id", async (req, res) => {
  let _parsedId = parsedId(req.params.id);
  if (_parsedId.length > 24) {
    return res.status(400).send("error, mismatch of id length");
  }
  try {
    task = await Task.findById(_parsedId);
    debugger;
    if (!task) {
      return res.status(404).send('Task "' + _parsedId + "\" don't exist.");
    } else {
      console.log("task found and fetched!");
      res.send(task);
    }
  } catch (error) {
    res.status(500).send();
  }
});

// ------------------------------------------------
app.listen(port, () => {
  console.log("server is up and running on port " + port);
});
