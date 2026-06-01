const express = require('express');
const router = express.Router();

const courses = [
  {
    id: 'tuition',
    title: 'Academic Tuition',
    subtitle: '6th to 12th Standard',
    description: 'Comprehensive academic coaching for students from 6th to 12th standard covering all major boards.',
    boards: ['CBSE', 'ICSE', 'Matric'],
    grades: '6th - 12th',
    subjects: ['Mathematics', 'Science', 'English', 'Social Science', 'Tamil', 'Hindi', 'Physics', 'Chemistry', 'Biology', 'Commerce'],
    features: ['Expert faculty with 10+ years experience', 'Small batch sizes (max 15 students)', 'Weekly tests & monthly assessments', 'Doubt-clearing sessions', 'Progress reports to parents', 'Study materials provided'],
    timing: 'Morning & Evening batches available',
    fee: 'Contact for details',
    icon: '📚'
  },
  {
    id: 'abacus',
    title: 'Abacus',
    subtitle: 'Mental Arithmetic Program',
    description: 'Develop lightning-fast mental calculation skills using the ancient abacus technique.',
    grades: '1st - 7th',
    features: ['Improves concentration & memory', 'Enhances mathematical skills', 'Boosts confidence', 'International certification available', 'Fun learning methodology'],
    timing: 'Weekend batches',
    fee: 'Contact for details',
    icon: '🧮'
  },
  {
    id: 'robotics',
    title: 'Robotics',
    subtitle: 'STEM & Technology',
    description: 'Hands-on robotics training that introduces students to engineering, coding, and problem-solving.',
    grades: '4th - 12th',
    features: ['Learn with real robot kits', 'Basic electronics & coding', 'Participate in competitions', 'Project-based learning', 'Develops logical thinking'],
    timing: 'Weekend & weekday batches',
    fee: 'Contact for details',
    icon: '🤖'
  },
  {
    id: 'spoken-english',
    title: 'Spoken English',
    subtitle: 'Communication Skills',
    description: 'Build confidence and fluency in English communication for academic and professional success.',
    grades: 'All ages',
    features: ['Pronunciation & accent training', 'Grammar & vocabulary building', 'Public speaking practice', 'Group discussions & debates', 'Personality development'],
    timing: 'Morning & Evening batches',
    fee: 'Contact for details',
    icon: '🗣️'
  },
  {
    id: 'hindi',
    title: 'Hindi',
    subtitle: 'Government Exam Preparation',
    description: 'Specialized Hindi coaching for government examinations and language proficiency.',
    grades: 'All standards',
    features: ['Government exam syllabus coverage', 'Hindi grammar & literature', 'Writing skills', 'Mock tests', 'Experienced Hindi faculty'],
    timing: 'Evening batches',
    fee: 'Contact for details',
    icon: '🔤'
  }
];

router.get('/', (req, res) => res.json({ success: true, data: courses }));
router.get('/:id', (req, res) => {
  const course = courses.find(c => c.id === req.params.id);
  if (!course) return res.status(404).json({ success: false, message: 'Course not found' });
  res.json({ success: true, data: course });
});

module.exports = router;
