const express = require('express');
const Event = require('../models/Event'); // Import the Event model
const router = express.Router();

// Route to create a new event
router.post('/create-event', async (req, res) => {
  try {
    const {name, eventDetails,date, location, eventStatus } = req.body;

    const eventId = `${name.substring(0, 3).toUpperCase()}_${location.substring(0, 3).toUpperCase()}_${Date.now().toString(36)}_${Math.floor(Math.random() * 1000).toString(36)}`;
    // Validate input (optional but recommended)
    if (!name || !date || !location || !eventStatus) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    // Create the event in the database
    const newEvent = await Event.create({
      eventId,
      name,
      eventDetails,
      date,
      location,
      eventStatus,
    });
    
    // Return the created event
    res.status(201).json(newEvent);
  } catch (error) {
    console.error('Error creating event:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Route to list all events
router.get('/events', async (req, res) => {
  try {
    // Fetch all events from the database
    const events = await Event.getAll();

    // Return the list of events
    res.status(200).json(events);
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;