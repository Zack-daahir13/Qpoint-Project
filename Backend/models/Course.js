const mongoose = require('mongoose');

const LessonSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
}, {
  timestamps: true,
});

const CourseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  instructor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User ',
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  duration: {
    type: String,
    required: true,
  },
  level: {
    type: String,
    required: true,
  },
  language: {
    type: String,
    required: true,
  },
  videoUrl: {
    type: String,
    required: true,
  },
  coverImage: {
    type: String,
    required: true,
  },
  lessons: [LessonSchema],
  isFree: {
    type: Boolean,
    default: false, // Indicates if the course is free
  },
  pointsRequired: {
    type: Number,
    default: 0, // Points required if the course is not free
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Course', CourseSchema);