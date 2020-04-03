const express = require("express");
const Task = require("../models/task");
const parsedId = require("../utils/utils");

const router = new express.Router();

// tasks methods----------------------------------------
///write new task
router.post("/tasks", async (req, res) => {
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
router.get("/tasks", async (req, res) => {
  try {
    const tasks = await Task.find({});
    res.send(tasks);
    console.log("all tasks fetched");
  } catch (error) {
    res.status(500).send();
  }
});

/// get task by id
router.get("/tasks/:id", async (req, res) => {
  debugger;
  let _parsedId = parsedId(req.params.id);
  if (_parsedId.length > 24) {
    return res.status(400).send("error, mismatch of id length");
  }
  try {
    debugger;
    const task = await Task.findById(_parsedId);
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

///update tasks
router.patch("/tasks/:id", async (req, res) => {
  let _parsedId = parsedId(req.params.id);
  if (_parsedId.length > 24) {
    return res.status(400).send("error, mismatch of id length");
  }

  const updates = Object.keys(req.body);
  const allowedUpdates = ["completed", "description"];
  const isValidOperation = updates.every(update =>
    allowedUpdates.includes(update)
  );
  if (!isValidOperation) {
    return res.status(400).send("Invalid updates.");
  }

  try {
    const updatedTask = await Task.findById(_parsedId);
    updates.forEach(update => (updatedTask[update] = req.body[update]));
    await updatedTask.save();

    if (!updatedTask) {
      return res.status(404).send("Task not found.");
    }
    res.send(updatedTask);
    console.log("Task updated.");
  } catch (error) {
    res.status(400).send(error.message);
  }
});

router.delete("/tasks/:id", async (req, res) => {
  let _parsedId = parsedId(req.params.id);
  if (_parsedId.length > 24) {
    return res.status(400).send("error, mismatch of id length");
  }

  task = await Task.findByIdAndDelete(_parsedId);

  try {
    if (!task) {
      return res.status(404).send("Task not found.");
    }
    res.send(task);
    console.log("Task " + task.name + " deleted");
  } catch (error) {
    res.status(500).send();
  }
});

module.exports = router;
