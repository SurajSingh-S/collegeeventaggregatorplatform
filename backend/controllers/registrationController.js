const Registration = require('../models/Registration');
const Event = require('../models/Event');

// Register for event (student only)
const registerForEvent = async (req, res) => {
  try {
    const { eventId } = req.body;

    // Check if event exists
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Check if event is in the future
    if (new Date(event.date) < new Date()) {
      return res.status(400).json({ message: 'Cannot register for past events' });
    }

    // Check if already registered
    const existingRegistration = await Registration.findOne({
      event: eventId,
      student: req.user._id
    });

    if (existingRegistration) {
      return res.status(400).json({ message: 'Already registered for this event' });
    }

    // Check if event is full
    const registrationCount = await Registration.countDocuments({ event: eventId });
    if (registrationCount >= event.maxParticipants) {
      return res.status(400).json({ message: 'Event is full' });
    }

    // Create registration
    const registration = new Registration({
      event: eventId,
      student: req.user._id
    });

    await registration.save();

    // Add registration to event
    event.registrations.push(registration._id);
    await event.save();

    await registration.populate('event', 'title date time location');

    res.status(201).json({
      message: 'Successfully registered for event',
      registration
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Cancel registration (student only)
const cancelRegistration = async (req, res) => {
  try {
    const { eventId } = req.params;

    const registration = await Registration.findOne({
      event: eventId,
      student: req.user._id
    });

    if (!registration) {
      return res.status(404).json({ message: 'Registration not found' });
    }

    // Remove registration from event
    await Event.findByIdAndUpdate(eventId, {
      $pull: { registrations: registration._id }
    });

    // Delete registration
    await Registration.findByIdAndDelete(registration._id);

    res.json({ message: 'Registration cancelled successfully' });
  } catch (error) {
    console.error('Cancel registration error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get student's registrations
const getStudentRegistrations = async (req, res) => {
  try {
    const registrations = await Registration.find({ student: req.user._id })
      .populate({
        path: 'event',
        populate: {
          path: 'organizer',
          select: 'name email department'
        }
      })
      .sort({ registrationDate: -1 });

    res.json(registrations);
  } catch (error) {
    console.error('Get student registrations error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Check if student is registered for event
const checkRegistration = async (req, res) => {
  try {
    const { eventId } = req.params;

    const registration = await Registration.findOne({
      event: eventId,
      student: req.user._id
    });

    res.json({ isRegistered: !!registration });
  } catch (error) {
    console.error('Check registration error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  registerForEvent,
  cancelRegistration,
  getStudentRegistrations,
  checkRegistration
};