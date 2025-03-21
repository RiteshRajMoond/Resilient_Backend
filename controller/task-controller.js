const Task = require("../models/Task");

// @desc Get all tasks
exports.getTasks = async (req, res, next) => {
  try {
    // extract page and limit and set defaul
    const { page = 1, limit = 10 } = req.query;

    // convert to integers
    const pageNumber = parseInt(page);
    const limitNumber = parseInt(limit);

    // Fetch tasks with pagination
    const tasks = await Task.find()
      .skip((pageNumber - 1) * limitNumber) // skipping documents for prev pages
      .limit(limitNumber) // limit the number of docs per page
      .lean();
    // lean() converts mongoose documents to plain JS objects. Mongoose docs are heavier than plain js as they contain extra methds like getters and setters

    // Get the total count of tasks
    const total = await Task.countDocuments();

    // return paginated response
    return res.status(200).json({
      success: true,
      count: tasks.length,
      total,
      page: pageNumber, // current page
      pages: Math.ceil(total / limitNumber), // Total Number of pages
      data: tasks, // Paginated tasks
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

// @desc Batching multiple tasks
exports.batchTasks = async (req, res, next) => {
  try {
    const { operations } = req.body; // expecting an arrat
    if (!Array.isArray(operations) || operations.length === 0) {
      return res.status(400).json({
        success: false,
        error: "Invalid or empty operation array",
      });
    }

    const results = await Promise.all(
      operations.map(async (operation) => {
        const { method, endpoint, data } = operation;

        switch (method.toUpperCase()) {
          case "GET":
            if (endpoint === "/tasks") {
              return await Task.find();
            }
            break;

          case "POST":
            if (endpoint === "/tasks") {
              const task = new Task(data);
              await task.save();
              return task;
            }
            break;

          case "PUT":
            if (endpoint.startWith("/tasks/")) {
              const id = endpoint.split("/")[2];
              return await Task.findByIdAndUpdate(id, data, { new: true });
            }
            break;

          case "DELETE":
            if (endpoint.startWith("/tasks/")) {
              const id = endpoint.split("/")[2];
              await Task.findByIdAndDelete(id);
              return { success: true, id };
            }
            break;

          default:
            return { error: `Unsupported Method: ${method}` };
        }
      })
    );

    return res.status(200).json({
      success: true,
      data: results,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// @desc Search Tasks by title
// When there are very big amounts of docs in mongodb, it is not a good
// idea to use .skip() fro pagination as it is very slow. We can use range-based
// pagination

// exports.searchTasks = async (req, res, next) => {
//   try {
//     const { search, page = 1, limit = 10 } = req.query;

//     if (!search) {
//       return res.status(400).json({
//         success: false,
//         error: "Search query is required",
//       });
//     }

//     const pageNumber = parseInt(page);
//     const limitNumber = parseInt(limit);

//     // performing Search
//     const tasks = await Task.find({ $text: { $search: search } })
//       .skip((pageNumber - 1) * limitNumber)
//       .limit(limitNumber)
//       .lean();

//     // const total = await Task.countDocuments({ $text: { $search: search } });
//     return res.status(200).json({
//       success: true,
//       count: tasks.length,
//       // total,
//       page: pageNumber,
//       // pages: Math.ceil(total / limitNumber),
//       data: tasks,
//     });
//   } catch (error) {
//     return res.status(500).json({
//       succes: false,
//       error: error.message,
//     });
//   }
// };

exports.searchTasks = async (req, res, next) => {
  try {
    const { search, limit = 10, lastId } = req.query;

    if (!search) {
      return res.status(400).json({
        success: false,
        error: "Search query is required",
      });
    }

    const limitNumer = parseInt(limit);
    const query = { $text: { $search: search } };

    if (lastId) {
      query._id = { $gt: lastId };
    }

    const tasks = await Task.find(query)
      .sort({ _id: 1 })
      .limit(limitNumer)
      .lean();

    return res.status(200).json({
      success: true,
      count: tasks.length,
      data: tasks,
      lastId: tasks.length > 0 ? tasks[tasks.length - 1]._id : null,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};
