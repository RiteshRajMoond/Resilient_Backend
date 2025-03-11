const { updateTask, deleteTask } = require("../controller/task-controller");
const Task = require("../models/Task");

const resolvers = {
  Query: {
    getTasks: async () => await Task.find(),
  },
  Mutation: {
    addTask: async (_, { title }) => {
      const task = new Task({ title });
      await task.save();
      return task;
    },
    updateTask: async (_, { id, completed }) => {
      return await Task.findByIdAndUpdate(id, { completed }, { new: true });
    },
    deleteTask: async (_, { id }) => {
      await Task.findByIdAndDelete(id);
      return "Task Deleted";
    },
  },
};

module.exports = resolvers;