// models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs'); // Using bcryptjs for password hashing

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  image: { type: String, default: null },
  points: { type: Number, default: 0 },
  role: {
    type: String,
    enum: ['participant', 'admin'],
    default: 'participant',
  },
  createdAt: { type: Date, default: Date.now },
});

// Method to compare passwords
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Pre-save hook to hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

module.exports = mongoose.model('User ', userSchema);