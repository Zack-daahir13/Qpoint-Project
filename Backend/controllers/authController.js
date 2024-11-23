// controllers/authController.js
const User = require('../models/User');
const jwt = require('jsonwebtoken');

const validRoles = ['participant', 'admin'];

// User Registration
const createUser  = async (req, res) => {
  const { name, email, password, role, image } = req.body;

  // Validate role
  if (!validRoles.includes(role)) {
    return res.status(400).json({ message: 'Invalid role provided' });
  }

  // Check for existing user
  const existingUser  = await User.findOne({ email });
  if (existingUser ) {
    return res.status(400).json({ message: 'Email already in use' });
  }

  // Validate input data
  if (!name || !email || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  // Create a new user
  const newUser  = new User({ name, email, password, role, image });

  try {
    await newUser .save();
    res.status(201).json({ message: 'User  created successfully', user: newUser  });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ message: error.message });
  }
};

// User Login
const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User  not found" });
    }

    // Validate password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Generate JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Return user data along with the token
    return res.status(200).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        image: user.image,
        points: user.points,
      }
    });
  } catch (error) {
    console.error("Error during login:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

module.exports = { createUser , login };