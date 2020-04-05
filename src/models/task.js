const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  description: {
    type: String,
    required: true,
    trim: true
  },
  completed: {
    type: Boolean,
    default: false
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User"
  }
}, {
  timestamps: true
})

taskSchema.methods.getPublicTask = function () {
  const task = this
  const taskObject = task.toObject()
  delete taskObject.__v
  delete taskObject.owner
  delete taskObject._id
  // delete taskObject.createdAt
  // delete taskObject.updatedAt
  return taskObject
}

const Task = mongoose.model("Task", taskSchema);

module.exports = Task;