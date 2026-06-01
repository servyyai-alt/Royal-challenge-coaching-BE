const mongoose = require('mongoose');

const replySchema = new mongoose.Schema({
  message: { type: String, required: true },
  repliedBy: { type: String, required: true },
  repliedAt: { type: Date, default: Date.now }
});

const enquirySchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, lowercase: true },
  phone: { type: String, required: true },
  grade: { type: String },
  course: {
    type: String,
    required: true,
    enum: ['Tuition (6th-12th)', 'Abacus', 'Robotics', 'Spoken English', 'Hindi (Govt Exam)', 'Other']
  },
  board: { type: String, enum: ['CBSE', 'ICSE', 'Matric', 'Not Applicable', ''] },
  message: { type: String },
  status: {
    type: String,
    enum: ['new', 'in-progress', 'replied', 'enrolled', 'closed'],
    default: 'new'
  },
  priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
  source: { type: String, default: 'website' },
  replies: [replySchema],
  notes: { type: String },
  assignedTo: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

enquirySchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Enquiry', enquirySchema);
