const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  createTutorRegistration,
  getAllTutorRegistrations,
  getTutorRegistration,
  updateTutorRegistration,
  deleteTutorRegistration,
  getTutorStats
} = require('../controllers/tutorRegistrationController');

router.post('/', createTutorRegistration);
router.get('/', protect, getAllTutorRegistrations);
router.get('/stats', protect, getTutorStats);
router.get('/:id', protect, getTutorRegistration);
router.put('/:id', protect, updateTutorRegistration);
router.delete('/:id', protect, deleteTutorRegistration);

module.exports = router;
