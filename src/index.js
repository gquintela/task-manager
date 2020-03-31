const express = require("express");
require("./db/mongoose");
const User = require("./models/user");
const Task = require("./models/task");

const app = express();

const port = process.env.PORT || 3000;

app.use(express.json()); /// parse incoming as json into an object

app.post("/users", (req, res) => {
  const user = new User(req.body);
  user
    .save()
    .then(user => {
      res.status(201).send(user);
      console.log("User " + user.name + " created.");
    })
    .catch(error => {
      res.status(400).send(error.message);
    });
});

app.post("/tasks", (req, res) => {
  const task = new Task(req.body);
  task
    .save()
    .then(task => {
      res.status(201).send(task);
      console.log("New task created.");
    })
    .catch(error => {
      res.status(400).send(error.message);
    });
});

app.get("/users", (req, res) => {
  User.find({})
    .then(users => {
      res.send(users);
    })
    .catch(error => {
      res.status(500).send(error);
    });
});

app.get("/users/:id", (req, res) => {
  let _id = req.params.id;
  while (_id.length < 12) {
    _id = "0" + _id;
  }
  if (_id.length > 12) {
    return res.status(400).send("error, mismatch of id length");
  }
  User.findById(_id)
    .then(user => {
      debugger;
      if (!user) {
        return res.status(404).send();
      } else {
        res.send(user);
      }
    })
    .catch(error => {
      debugger;
      res.status(500).send();
    });
});

// ------------------------------------------------
app.listen(port, () => {
  console.log("server is up and running on port " + port);
});
