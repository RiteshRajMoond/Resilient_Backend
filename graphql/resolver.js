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
      const deletedTask = await Task.findByIdAndDelete(id);
      if(!deletedTask) 
          throw new Error("Task not found");
      return deletedTask;
    },
  },
};

module.exports = resolvers;
