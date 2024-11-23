// routes/leaderboardRoutes.js
const express = require('express');
const router = express.Router();
const leaderboardController = require('../controllers/leaderboardController');
const { authenticate } = require('../middlewares/authMiddleware'); // Assuming you have this middleware

router.get('/', authenticate, leaderboardController.getLeaderboard);

module.exports = router;