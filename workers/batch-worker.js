const { parentPort } = require("worker_threads");
const Task = require("../models/Task");

const processBatch = async (operations) => {
  const results = [];

  for (const operation of operations) {
    const { method, endpoint, data } = operation;

    try {
      switch (method.toUpperCase()) {
        case "POST":
          if (endpoint === "/tasks") {
            const task = new Task(data);
            await task.save();
            results.push(task);
          }
          break;

        case "PUT":
          if (endpoint.startsWith("/tasks/")) {
            const id = endpoint.split("/")[2];
            const updatedTask = await Task.findByIdAndUpdate(id, data, {
              new: true,
            });
            results.push(updatedTask);
          }
          break;

        case "DELETE":
          if (endpoint.startsWith("/tasks/")) {
            const id = endpoint.split("/")[2];
            await Task.findByIdAndDelete(id);
            results.push({ success: true, id });
          }
          break;

        default:
          results.push({ error: `Unsupported Method: ${method}` });
      }
    } catch (error) {
      results.push({ error: error.message });
    }
  }

  return results;
};

parentPort.on("message", async (operations) => {
  try {
    const results = await processBatch(operations);
    parentPort.postMessage(results);
  } catch (error) {
    parentPort.postMessage({ error: error.message });
  }
});
