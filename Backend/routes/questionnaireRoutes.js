// routes/questionnaireRoutes.js
const express = require('express');
const { 
    createQuestionnaire, 
    getQuestionnaires, 
    getQuestionnaireById, 
    submitResponse, 
    updateQuestionnaire, 
    deleteQuestionnaire 
} = require('../controllers/questionnaireController');
const { authenticate, authorizeAdmin } = require('../middlewares/authMiddleware'); // Assuming you have an authentication middleware
const router = express.Router();

// Protect the routes with authentication
router.use(authenticate);

// Create a new questionnaire
router.post('/create', createQuestionnaire);

// Get all questionnaires for the authenticated researcher
router.get('/', getQuestionnaires);

// Get a specific questionnaire by ID
router.get('/:id', getQuestionnaireById);

router.post('/:id/responses', submitResponse);

// Update a questionnaire (admin only)
router.put('/:id', authorizeAdmin, updateQuestionnaire);

// Delete a questionnaire (admin only)
router.delete('/:id', authorizeAdmin, deleteQuestionnaire);

module.exports = router;