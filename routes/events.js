const express = require('express');
const Event = require('../models/Event'); // Import the Event model
const authOrganizer = require('../middleware/authOrganizer');
const req = require('express/lib/request');
const res = require('express/lib/response');
const eventcontroller = require('../controller/eventscontroller');
const router = express.Router();

// Route to create a new event
router.post('/create-events', authOrganizer,eventcontroller.createEvent)
// Route to list all events
router.get('/events',eventcontroller.getAllEvents)
//update event with authorizing middleware with only the creator having the privilage
router.put('/update-events/:eventId', authOrganizer,eventcontroller.updateEvents )

//deleting event with authorizing middleware with only the creator having the privilage
router.delete('/delete-events/:eventId', authOrganizer, eventcontroller.deleteEvents)

//get event detail only one event by eventid
router.get('/get-events/:eventId',eventcontroller.getEventsByID)

module.exports = router;