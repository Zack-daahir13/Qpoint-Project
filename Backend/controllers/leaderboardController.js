// controllers/leaderboardController.js
const User = require('../models/User');

exports.getLeaderboard = async (req, res) => {
    try {
        const users = await User.find()
            .sort({ points: -1 })
            .limit(10)
            .select('name points'); 

        console.log("Leaderboard Data:", users); // Log the data being sent to the frontend

        const leaderboard = users.map((user, index) => ({
            rank: index + 1,
            name: user.name,
            points: user.points
        }));

        res.status(200).json(leaderboard);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching leaderboard', error: error.message });
    }
};