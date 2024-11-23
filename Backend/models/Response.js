const mongoose = require('mongoose');

const pointsSchema = new mongoose.Schema({
  participantId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  questionnaireId: { type: mongoose.Schema.Types.ObjectId, ref: 'Questionnaire', required: true },
  pointsEarned: { type: Number, required: true }
});

module.exports = mongoose.model('Points', pointsSchema);
