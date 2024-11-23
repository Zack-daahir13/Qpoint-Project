// routes/authRoutes.js
const express = require('express');
const { createUser, login } = require('../controllers/authController');
const upload = require('../middlewares/uploads');
const { authenticate, authorizeAdmin } = require('../middlewares/authMiddleware');

const router = express.Router();

// Register route
router.post('/register', upload.single('image'), createUser);

// Login route
router.post('/login', login);

// Protect the routes with authentication
router.use(authenticate);

module.exports = router; 

