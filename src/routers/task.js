const express = require("express");
const Task = require("../models/task");
// const parsedId = require("../utils/utils");
const auth = require("../middleware/auth");

const router = new express.Router();

// tasks methods----------------------------------------
///write new task
//max tasks per user: 100
router.post("/tasks", auth, async (req, res) => {
  const task = new Task(req.body);
  task.owner = req.user._id;
  const num = req.user.tasksCount

  debugger
  try {
    if (num > 49) {
      throw new Error("You have 50 tasks. Please delete one in order to continue adding tasks.")
    }

    await task.save();
    res.status(201).send(task.getPublicTask());
    req.user.tasksCount++
    req.user.save()
    console.log('New task "' + task.description + '" created.');
  } catch (error) {
    res.status(400).send(error.message);
  }
});

///get all tasks for a user ?completed=true
//GET /tasks?limit=10&skip=20 (support for limit and pagination)
//GET /tasks?sortBy=createdAt:desc
router.get("/tasks", auth, async (req, res) => {
  debugger;
  let match = {};
  let sortObj = {};

  if (req.query.completed) {
    match["completed"] = req.query.completed === "true";
  }

  if (req.query.sortBy) {
    const parts = req.query.sortBy.split(":");
    const keyToSort = parts[0];
    const criteria = parts[1];
    sortObj = {
      [keyToSort]: criteria
    };
  }

  try {
    const tasks = await Task.find({
        owner: req.user._id,
        ...match,
      })
      .skip(parseInt(req.query.skip))
      .limit(parseInt(req.query.limit))
      .sort(sortObj);
    res.send(tasks);
    console.log("Tasks fetched");
  } catch (error) {
    res.status(500).send();
  }
});

/// get task by id
router.get("/tasks/:id", auth, async (req, res) => {
  const _id = req.params.id;
  try {
    const task = await Task.findOne({
      _id,
      owner: req.user._id,
    });
    if (!task) {
      return res.status(404).send();
    } else {
      console.log("task found and fetched!");
      res.send(task);
    }
  } catch (error) {
    res.status(500).send();
  }
});

///update tasks
router.patch("/tasks/:id", auth, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ["completed", "description"];
  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update)
  );
  if (!isValidOperation) {
    return res.status(400).send("Invalid updates.");
  }

  try {
    const updatedTask = await Task.findOne({
      _id: req.params.id,
      owner: req.user._id,
    });

    if (!updatedTask) {
      return res.status(404).send("Task not found.");
    }

    updates.forEach((update) => (updatedTask[update] = req.body[update]));
    await updatedTask.save();

    res.send(updatedTask);
    console.log("Task updated.");
  } catch (error) {
    res.status(400).send(error.message);
  }
});

///middleware is used
router.delete("/tasks/:id", auth, async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      owner: req.user._id,
    });
    if (!task) {
      return res.status(404).send("Task not found.");
    }
    req.user.tasksCount--
    req.user.save()
    res.send({
      message: "Task " + task.description + " deleted",
    });
    console.log("Task " + task.description + " deleted");
  } catch (error) {
    res.status(500).send();
  }
});

module.exports = router;