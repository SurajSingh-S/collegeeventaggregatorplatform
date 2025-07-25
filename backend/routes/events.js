const express = require('express');
const {
  getEvents,
  getEvent,
  createEvent,
  updateEvent,
  deleteEvent,
  getOrganizerEvents
} = require('../controllers/eventController');
const { auth, organizer } = require('../middleware/auth');
const upload = require('../middleware/upload');


const router = express.Router();

// @route   GET /api/events
// @desc    Get all events
// @access  Public
router.get('/', getEvents);

// @route   GET /api/events/organizer
// @desc    Get organizer's events
// @access  Private (organizer only)
router.get('/organizer', auth, organizer, getOrganizerEvents);

// @route   GET /api/events/:id
// @desc    Get single event
// @access  Public
router.get('/:id', getEvent);

// @route   POST /api/events
// @desc    Create event
// @access  Private (organizer only)
router.post('/', auth, organizer,upload.single('bannerImage'), createEvent);

// @route   PUT /api/events/:id
// @desc    Update event
// @access  Private (organizer only)
router.put('/:id', upload.single('bannerImage'), updateEvent)

// @route   DELETE /api/events/:id
// @desc    Delete event
// @access  Private (organizer only)
router.delete('/:id', auth, organizer, deleteEvent);

module.exports = router;