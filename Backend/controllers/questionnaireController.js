const Questionnaire = require('../models/Questionnaire');

// Create a new questionnaire
exports.createQuestionnaire = async (req, res) => {
    const { title, description, link, points, deadline, requiredResponses, estimatedTime } = req.body;

    try {
        const newQuestionnaire = new Questionnaire({
            title,
            description,
            participant_id: req.user.id, // Assuming you have the researcher ID from the authenticated user
            link,
            points,
            deadline,
            requiredResponses,
            estimatedTime,
        });

        await newQuestionnaire.save();
        res.status(201).json(newQuestionnaire);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get all questionnaires for all users
exports.getQuestionnaires = async (req, res) => {
    try {
        const questionnaires = await Questionnaire.find(); // Fetch all questionnaires
        res.status(200).json(questionnaires);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get a specific questionnaire by ID
exports.getQuestionnaireById = async (req, res) => {
    try {
        const questionnaire = await Questionnaire.findById(req.params.id);
        if (!questionnaire) {
            return res.status(404).json({ message: 'Questionnaire not found' });
        }
        res.status(200).json(questionnaire);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Increment response count for a questionnaire and record time taken
exports.submitResponse = async (req, res) => {
    const { startTime, endTime } = req.body;
    const questionnaireId = req.params.id;
    const userId = req.user.id;

    try {
        // Check if user has already responded to this questionnaire
        const existingResponse = await Questionnaire.findOne({
            _id: questionnaireId,
            'responses.userId': userId
        });

        if (existingResponse) {
            return res.status(400).json({ message: 'You have already submitted a response for this questionnaire.' });
        }

        // Calculate time taken in milliseconds
        const timeTaken = new Date(endTime) - new Date(startTime);
        if (isNaN(timeTaken)) {
            return res.status(400).json({ message: 'Invalid time format.' });
        }

        // Update the questionnaire with the new response
        const questionnaire = await Questionnaire.findByIdAndUpdate(
            questionnaireId,
            { 
                $inc: { responsesCount: 1 },
                $push: { 
                    responses: { userId, responseTime: timeTaken }
                }
            },
            { new: true }
        );

        if (!questionnaire) {
            return res.status(404).json({ message: 'Questionnaire not found' });
        }

        const pointsAwarded = questionnaire.points;

        // Update user's points
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User  not found' });
        }

        // Ensure points is initialized
        if (user.points === undefined) {
            user.points = 0;
        }

        user.points += pointsAwarded; // Award points for the current response
        await user.save();

        res.status(200).json({ 
            message: 'Response recorded successfully',
            points: pointsAwarded,
            totalPoints: user.points,
            questionnaire,
            timeTaken // Send time taken back to the frontend
        });
    } catch (error) {
        console.error("Error submitting response:", error.message); 
        res.status(500).json({ message: 'An error occurred while submitting the response. Please try again later.' });
    }
};

// Update a questionnaire
exports.updateQuestionnaire = async (req, res) => {
    const { title, description, link, points, deadline, requiredResponses, estimatedTime } = req.body;

    try {
        const updatedQuestionnaire = await Questionnaire.findByIdAndUpdate(
            req.params.id,
            { title, description, link, points, deadline, requiredResponses, estimatedTime },
            { new: true, runValidators: true }
        );

        if (!updatedQuestionnaire) {
            return res.status(404).json({ message: 'Questionnaire not found' });
        }

        res.status(200).json(updatedQuestionnaire);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete a questionnaire
exports.deleteQuestionnaire = async (req, res) => {
    try {
        const deletedQuestionnaire = await Questionnaire.findByIdAndDelete(req.params.id);

        if (!deletedQuestionnaire) {
            return res.status(404).json({ message: 'Questionnaire not found' });
        }

        res.status(204).send(); // No content to send back
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};