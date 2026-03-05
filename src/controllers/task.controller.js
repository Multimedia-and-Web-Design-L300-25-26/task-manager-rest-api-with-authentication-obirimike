import task from '../models/task.model.js';

// Create a new task
export const createTask = async (req, res) => {
    try {
        const { title, description } = req.body;
        const newTask = new task({
            title,
            description,
            owner: req.user._id,
        });
        await newTask.save();
        res.status(201).json(newTask);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Get all tasks for the authenticated user
export const getTasks = async (req, res) => {
    try {
        const tasks = await task.find({ owner: req.user._id });
        res.status(200).json(tasks);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};  

// Delete a task by ID
export const deleteTask = async (req, res) => {
    try {   
        const deletedTask = await task.findOneAndDelete({ _id: req.params.id, owner: req.user._id });
        if (!deletedTask) {
            return res.status(404).json({ message: "Task not found" });
        }   
        res.status(200).json({ message: "Task deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
