import express from "express";
import Task from "../models/Task.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// Apply auth middleware
router.use(authMiddleware);

// POST /api/tasks
router.post("/", async (req, res) => {
  // - Create task
  // - Attach owner = req.user._id

  const { title, description } = req.body;
  if (!title) {
      return res.status(400).json({ message: "Title is required" });
  }
  try {
      const newTask = new Task({
          title,
          description,
          owner: req.user._id,
      });
      await newTask.save();
      res.status(201).json(newTask);
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
});

// GET /api/tasks
router.get("/", async (req, res) => {
  // - Return only tasks belonging to req.user

  const userId = req.user._id;
  try {
      const tasks = await Task.find({ owner: userId });
      res.status(200).json(tasks);
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
});

// DELETE /api/tasks/:id
router.delete("/:id", async (req, res) => {
  // - Check ownership
  // - Delete task

  const taskId = req.params.id;
  try {
      const deletedTask = await Task.findOneAndDelete({ _id: taskId, owner: req.user._id });
      if (!deletedTask) {
          return res.status(404).json({ message: "Task not found" });
      }
      res.status(200).json({ message: "Task deleted successfully" });
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
});

export default router;
