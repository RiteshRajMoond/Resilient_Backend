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

// TaskSchema.index({createdAt: 1}); // ascending order on createdAt

// We have removed this index after adding compund index as compound index 
// follows the prefix rule. Which means it can handle this case already. 
// So this was redundant. So as to reduce the space we can remove this index without 
// affecting performance.

// Simple Index
TaskSchema.index({updatedAt: 1}); // ascending order on updatedAt

// Compound Index
TaskSchema.index({createdAt: 1, completed: 1}); // ascending order on createdAt and completed

// Text Indexing
TaskSchema.index({title: "text"});

module.exports = mongoose.model("Task", TaskSchema);