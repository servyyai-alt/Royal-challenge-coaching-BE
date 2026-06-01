const express = require('express');
const router = express.Router();
const {
  createEnquiry, getAllEnquiries, getEnquiry,
  updateEnquiry, replyToEnquiry, deleteEnquiry, getStats
} = require('../controllers/enquiryController');
const { protect } = require('../middleware/auth');

// Public
router.post('/', createEnquiry);

// Admin only
router.get('/', protect, getAllEnquiries);
router.get('/stats', protect, getStats);
router.get('/:id', protect, getEnquiry);
router.put('/:id', protect, updateEnquiry);
router.post('/:id/reply', protect, replyToEnquiry);
router.delete('/:id', protect, deleteEnquiry);

module.exports = router;
