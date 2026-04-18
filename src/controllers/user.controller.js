import user from '../models/user.model.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';



// Register a new user
export const registerUser = async (req, res) => {
    try {   
        const { name, email, password } = req.body;
        const existingUser = await user.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email already in use" });
        }   
        const newUser = new user({ name, email, password });
        await newUser.save();
        res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Login user and return JWT token
export const loginUser = async (req, res) => {
    try {   
        const { email, password } = req.body;
        const existingUser = await user.find
One({ email });
        if (!existingUser) {
            return res.status(400).json({ message: "Invalid email or password" });
        }   
        const isPasswordValid = await bcrypt.compare(password, existingUser.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: "Invalid email or password" });
        }   
        const token = jwt.sign({ userId: existingUser._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.status(200).json({ token });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Get authenticated user's profile
export const getUserProfile = async (req, res) => {
    try {   
        const user = await user.findById(req.user._id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }   
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete authenticated user's account
export const deleteUser = async (req, res) => {
    try {
        await user.findByIdAndDelete(req.user._id);
        res.status(200).json({ message: "User account deleted successfully" });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update authenticated user's profile
export const updateUserProfile = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const updatedData = {};
        if (name) updatedData.name = name;
        if (email) updatedData.email = email;
        if (password) updatedData.password = password;
        const updatedUser = await user.findByIdAndUpdate(req.user._id, updatedData, { new: true });
        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json(updatedUser);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

