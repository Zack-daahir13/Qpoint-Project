const Course = require('../models/Course');

exports.createCourse = async (req, res) => {
    try {
        const { 
            title, 
            description, 
            instructor, 
            price, 
            duration, 
            level, 
            language, 
            videoUrl, 
            coverImage, 
            lessons, 
            isFree, 
            pointsRequired 
        } = req.body;

        // Validate lessons
        if (!Array.isArray(lessons) || lessons.length === 0) {
            return res.status(400).json({ message: 'Lessons are required.' });
        }

        // Validate points if the course is not free
        if (!isFree && pointsRequired <= 0) {
            return res.status(400).json({ message: 'Points required must be greater than 0 for paid courses.' });
        }

        const newCourse = new Course({ 
            title, 
            description, 
            instructor, 
            price, 
            duration, 
            level, 
            language, 
            videoUrl, 
            coverImage, 
            lessons, 
            isFree, 
            pointsRequired 
        });

        const course = await newCourse.save();
        res.status(201).json(course);
    } catch (error) {
        if (error.name === 'ValidationError') {
            return res.status(400).json({ message: 'Validation Error', error: error.message });
        }
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

exports.getCourses = async (req, res) => {
    try {
        const courses = await Course.find().populate('instructor', 'name');
        res.status(200).json(courses);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

exports.getCourse = async (req, res) => {
    try {
        const course = await Course.findById(req.params.id).populate('instructor', 'name');
        if (!course) return res.status(404).json({ message: 'Course not found' });
        res.status(200).json(course);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// Update a course by ID
exports.updateCourse = async (req, res) => {
  try {
      const { title, description, price, duration, level, language, videoUrl, coverImage, lessons, isFree, pointsRequired } = req.body;

      const updatedCourse = await Course.findByIdAndUpdate(req.params.id, {
          title,
          description,
          price,
          duration,
          level,
          language,
          videoUrl,
          coverImage,
          lessons,
          isFree,
          pointsRequired
      }, { new: true });

      if (!updatedCourse) {
          return res.status(404).json({ message: 'Course not found' });
      }

      res.status(200).json(updatedCourse);
  } catch (error) {
      res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// Delete a course by ID
exports.deleteCourse = async (req, res) => {
  try {
      const deletedCourse = await Course.findByIdAndDelete(req.params.id);

      if (!deletedCourse) {
          return res.status(404).json({ message: 'Course not found' });
      }

      res.status(204).json(); // No content to send back
  } catch (error) {
      res.status(500).json({ message: 'Server Error', error: error.message });
  }
};