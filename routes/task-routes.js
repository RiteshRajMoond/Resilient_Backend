const express = require("express");

const router = express.Router();

const taskController = require("../controller/task-controller");

router.get("/", taskController.getTasks);
router.get("/search", taskController.searchTasks);

router.post("/", taskController.createTask);
router.post("/batch", taskController.batchTasks);

router.put("/:id", taskController.updateTask);

router.delete("/:id", taskController.deleteTask);

module.exports = router;
