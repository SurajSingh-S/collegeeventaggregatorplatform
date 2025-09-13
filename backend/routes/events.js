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


router.get('/', getEvents);

router.get('/organizer', auth, organizer, getOrganizerEvents);

router.get('/:id', getEvent);


router.post('/', auth, organizer,upload.single('bannerImage'), createEvent);


router.put('/:id', upload.single('bannerImage'), updateEvent)


router.delete('/:id', auth, organizer, deleteEvent);

module.exports = router;