const mongoose = require('mongoose');

const tutorRegistrationSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  tutorCode: { type: String, required: true, trim: true },
  genderAge: { type: String, required: true, trim: true },
  interestedInTeaching: {
    type: String,
    required: true,
    enum: ['Home Tuition', 'Group Tuition']
  },
  city: { type: String, required: true, trim: true },
  area: { type: String, required: true, trim: true },
  subarea: { type: String, required: true, trim: true },
  preferredArea: { type: String, required: true, trim: true },
  experienceOfTeaching: { type: String, required: true, trim: true },
  interestedInClass: { type: String, required: true, trim: true },
  interestedInSubjects: { type: String, required: true, trim: true },
  qualification: { type: String, required: true, trim: true },
  feesExpectation: { type: String, required: true, trim: true },
  phone: { type: String, trim: true },
  email: { type: String, trim: true, lowercase: true },
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
