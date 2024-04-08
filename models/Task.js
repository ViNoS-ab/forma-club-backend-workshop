const mongoose = require("mongoose");

const TaskSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "must provide name"],
    trim: true,
  },
  completed: {
    type: Boolean,
    default: false,
    },
    User: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true, 
  }
});

const Task = mongoose.model("Task", TaskSchema);
module.exports = Task;
