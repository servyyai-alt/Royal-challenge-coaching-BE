const mongoose = require('mongoose');
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const tutorRegistrationSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  tutorCode: { type: String, trim: true },
  genderAge: { type: String, trim: true },
  interestedInTeaching: {
    type: String,
    trim: true,
    validate: {
      validator: (value) => !value || ['Home Tuition', 'Group Tuition'].includes(value),
      message: 'Invalid interestedInTeaching value'
    }
  },
  address: { type: String, required: true, trim: true },
  experienceOfTeaching: { type: String, trim: true },
  interestedInClass: { type: String,  trim: true },
  interestedInSubjects: { type: String, trim: true },
  qualification: { type: String, trim: true },
  feesExpectation: { type: String, trim: true },
  phone: { type: String, trim: true, required: true },
  email: {
    type: String,
    trim: true,
    lowercase: true,
    required: true,
    validate: {
      validator: (value) => EMAIL_RE.test(String(value || '').trim()),
      message: 'Please enter a valid email address.'
    }
  },
  status: {
    type: String,
    enum: ['pending', 'approved'],
    default: 'pending'
  },
  notes: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

tutorRegistrationSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('TutorRegistration', tutorRegistrationSchema);
