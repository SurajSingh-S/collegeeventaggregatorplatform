const express = require('express');
const {
  registerForEvent,
  cancelRegistration,
  getStudentRegistrations,
  checkRegistration
} = require('../controllers/registrationController');
const { auth, student } = require('../middleware/auth');

const router = express.Router();

// @route   POST /api/registrations
// @desc    Register for event
// @access  Private (student only)
router.post('/', auth, student, registerForEvent);

// @route   DELETE /api/registrations/:eventId
// @desc    Cancel registration
// @access  Private (student only)
router.delete('/:eventId', auth, student, cancelRegistration);

// @route   GET /api/registrations/student
// @desc    Get student's registrations
// @access  Private (student only)
router.get('/student', auth, student, getStudentRegistrations);

// @route   GET /api/registrations/check/:eventId
// @desc    Check if student is registered for event
// @access  Private (student only)
router.get('/check/:eventId', auth, student, checkRegistration);

module.exports = router;