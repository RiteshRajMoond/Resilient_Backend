const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Task = require("./models/Task");

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

const generateDummyTasks = async (count) => {
  const tasks = [];
  for (let i = 0; i < count; i++) {
    tasks.push({
      title: `Random Task ${i + 1}`,
      completed: Math.random() < 0.5,
    });
  }
  return tasks;
};

const insertDummyData = async () => {
  try {
    const dummyTasks = await generateDummyTasks(100000);
    await Task.insertMany(dummyTasks);
  } catch (error) {
    console.error(error);
    process.exit(1);
  } finally {
    mongoose.connection.close();
  }
};

const run = async () => {
  await connectDB();
  await insertDummyData();
};

run();
