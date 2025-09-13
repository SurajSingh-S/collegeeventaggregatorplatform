const express = require('express');
const {
  registerForEvent,
  cancelRegistration,
  getStudentRegistrations,
  checkRegistration
} = require('../controllers/registrationController');
const { auth, student } = require('../middleware/auth');

const router = express.Router();


router.post('/', auth, student, registerForEvent);


router.delete('/:eventId', auth, student, cancelRegistration);


router.get('/student', auth, student, getStudentRegistrations);


router.get('/check/:eventId', auth, student, checkRegistration);

module.exports = router;