// models/Questionnaire.js
const mongoose = require('mongoose');

const QuestionnaireSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    participant_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    link: {
        type: String,
        required: true,
    },
    points: {
        type: Number,
        required: true,
    },
    deadline: {
        type: Date,
        required: true,
    },
    responsesCount: {
        type: Number,
        default: 0,
    },
    requiredResponses: {
        type: Number,
        required: true,
    },
    estimatedTime: {
        type: Number,
        required: true,
    },
    responseTimes: {
        type: [Number],
        default: [],
    },
}, { timestamps: true });

module.exports = mongoose.model('Questionnaire', QuestionnaireSchema);