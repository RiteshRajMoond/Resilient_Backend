const Task = require("../models/Task");

// @desc Get all tasks
exports.getTasks = async (req, res, next) => {
  try {
    const tasks = await Task.find();
    return res.status(200).json({
      success: true,
      count: tasks.length,
      data: tasks,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// @desc Create a task
exports.createTask = async (req, res, next) => {
  try {
    const task = await Task(req.body);
    await task.save();
    return res.status(201).json({
      success: true,
      data: task,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// @desc Update a task
exports.updateTask = async (req, res, next) => {
  try {
    const { id } = req.params;
    const task = await Task.findByIdAndUpdate(id, req.body, { new: true });
    return res.status(200).json({
      success: true,
      data: task,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// @desc Delete a task
exports.deleteTask = async (req, res, next) => {
  try {
    const { id } = req.params;
    await Task.findByIdAndDelete(id);
    return res.status(200).json({
      success: true,
      data: {},
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};
