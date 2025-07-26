const Event = require('../models/Event');
const Registration = require('../models/Registration');

// Get all events
const getEvents = async (req, res) => {
  try {
    const { category, search, date } = req.query;
    let query = {};

    // Filter by category
    if (category && category !== 'all') {
      query.category = category;
    }

    // Search by title or description
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    // Filter by date
    if (date) {
      const startDate = new Date(date);
      const endDate = new Date(date);
      endDate.setDate(endDate.getDate() + 1);
      query.date = { $gte: startDate, $lt: endDate };
    }

    const events = await Event.find(query)
      .populate('organizer', 'name email department')
      .populate('registrations')
      .sort({ date: 1 });

    res.json(events);
  } catch (error) {
    console.error('Get events error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get single event
const getEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate('organizer', 'name email department')
      .populate({
        path: 'registrations',
        populate: {
          path: 'student',
          select: 'name email studentId department'
        }
      });

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    res.json(event);
  } catch (error) {
    console.error('Get event error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Create event (organizer only)
const createEvent = async (req, res) => {
  try {
const { title, description, date, time, location, category, maxParticipants } = req.body;
// const bannerImage = req.file ? `/uploads/${req.file.filename}` : ''; 
//const bannerImage = req.file ? `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}` : '';

// In your createEvent controller, save the full URL
bannerImage: req.file ? `https://collegeeventaggregatorplatform-wayabove.onrender.com/uploads/${req.file.filename}` : null

    const event = new Event({
      title,
      description,
      date,
      time,
      location,
      category,
      maxParticipants,
      bannerImage,
      organizer: req.user._id
    });

    await event.save();
    await event.populate('organizer', 'name email department');

    res.status(201).json({
      message: 'Event created successfully',
      event
    });
  } catch (error) {
    console.error('Create event error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update event (organizer only - own events)
// const updateEvent = async (req, res) => {
//   try {
//     const event = await Event.findById(req.params.id);

//     if (!event) {
//       return res.status(404).json({ message: 'Event not found' });
//     }

//     // Check if user is the organizer of this event
//     if (event.organizer.toString() !== req.user._id.toString()) {
//       return res.status(403).json({ message: 'Not authorized to update this event' });
//     }

//     const updatedEvent = await Event.findByIdAndUpdate(
//       req.params.id,
//       req.body,
//       { new: true, runValidators: true }
//     ).populate('organizer', 'name email department');

//     res.json({
//       message: 'Event updated successfully',
//       event: updatedEvent
//     });
//   } catch (error) {
//     console.error('Update event error:', error);
//     res.status(500).json({ message: 'Server error' });
//   }
// };



const updateEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
    if (!event) return res.status(404).json({ message: 'Event not found' })

    // Update fields
    event.title = req.body.title || event.title
    event.description = req.body.description || event.description
    event.date = req.body.date || event.date
    event.time = req.body.time || event.time
    event.location = req.body.location || event.location
    event.category = req.body.category || event.category
    event.maxParticipants = req.body.maxParticipants || event.maxParticipants

    // Handle banner image
    if (req.file) {
      event.bannerImage = `/uploads/${req.file.filename}`
    }

    const updatedEvent = await event.save()
    res.status(200).json(updatedEvent)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Server Error' })
  }
}


// Delete event (organizer only - own events)
const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Check if user is the organizer of this event
    if (event.organizer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this event' });
    }

    // Delete all registrations for this event
    await Registration.deleteMany({ event: req.params.id });

    // Delete the event
    await Event.findByIdAndDelete(req.params.id);

    res.json({ message: 'Event deleted successfully' });
  } catch (error) {
    console.error('Delete event error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get organizer's events
const getOrganizerEvents = async (req, res) => {
  try {
    const events = await Event.find({ organizer: req.user._id })
      .populate('organizer', 'name email department')
      .populate('registrations')
      .sort({ date: 1 });

    res.json(events);
  } catch (error) {
    console.error('Get organizer events error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getEvents,
  getEvent,
  createEvent,
  updateEvent,
  deleteEvent,
  getOrganizerEvents
};