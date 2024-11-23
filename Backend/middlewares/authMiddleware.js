// middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.authenticate = async (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1]; // Extract token from "Bearer <token>"

    if (!token) {
        console.log("No token provided");
        return res.status(401).json({ message: 'No token provided' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id); // Get user from database
        if (!req.user) {
            return res.status(404).json({ message: 'User  not found' });
        }
        next();
    } catch (err) {
        if (err.name === 'TokenExpiredError') {
            console.error("Token expired:", err);
            return res.status(401).json({ message: 'Token expired' });
        }
        console.error("Failed to authenticate token:", err);
        return res.status(403).json({ message: 'Failed to authenticate token' });
    }
};

exports.authorizeAdmin = (req, res, next) => {
    if (!req.user || !req.user.role) {
      return res.status(403).json({ message: 'Access denied. No role found.' });
    }
  
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admins only.' });
    }
  
    next(); // User is authorized
  };