const mongoose = require("mongoose");

const TaskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    completed: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Adding indexes for optimised queries
TaskSchema.index({createdAt: 1}); // ascending order on createdAt
TaskSchema.index({updatedAt: 1}); // ascending order on updatedAt

module.exports = mongoose.model("Task", TaskSchema);