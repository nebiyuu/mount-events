const Event = require('../models/Event');

exports.createEvent = async (req, res) => {
    try {
      const {name, eventDetails,date, location, eventStatus } = req.body;
      role =req.role;
      user_id = req.user_id;
      console.log("asdfasdfa"+ user_id);
  
      const eventId = `${name.substring(0, 3).toUpperCase()}_${location.substring(0, 3).toUpperCase()}_${Date.now().toString(36)}_${Math.floor(Math.random() * 1000).toString(36)}`;
      // Validate input (optional but recommended)
      if (!name || !date || !location || !eventStatus) {
        return res.status(400).json({ message: 'All fields are required' });
      }
      // Create the event in the database
      if (role =='Organizer') {
        const newEvent = await Event.create({
          eventId,
          name,
          eventDetails,
          date,
          location,
          eventStatus,
          user_id
          });
          // Return the created event
      res.status(201).json(newEvent);
        }else{
          res.status(401).json({message:'not authorized to create event'});
  
        }
      
    } catch (error) {
      console.error('Error creating event:', error);
      res.status(500).json({ message: 'Server error' });
    }
  };

exports.getAllEvents =  async (req, res) => {
    try {
      // Fetch all events from the database
      const events = await Event.getAll();
  
      // Return the list of events
      res.status(200).json(events);
    } catch (error) {
      console.error('Error fetching events:', error);
      res.status(500).json({ message: 'Server error' });
    }
  };
  
exports.updateEvents = async (req, res) => {
    const eventId = req.params.eventId;
    const eventData = req.body;
    //console.log("1");
  
    try {
      const event = await Event.getById(eventId); // Assume this fetches event data
      if (!event) return res.status(404).json({ message: 'Event not found' });
  
      // Check if the current organizer owns this event
      if (event.user_id !== req.user_id) {
        console.log("1" + event.user_id);
        console.log("2" + req.user_id);
  
  
  
        return res.status(403).json({ message: 'You can only update your own events' });
      }
  
      console.log("3" + eventId);
      const updatedEvent = await Event.update(eventId, eventData);
      console.log("4" + eventId);
  
      res.status(200).json(updatedEvent);
    } catch (err) {
      res.status(500).json({ message: 'Update failed', error: err.message });
    }
  };

exports.deleteEvents = async (req, res) => {
    const eventId = req.params.eventId;
  
    try {
      // First get the event to check ownership
      const event = await Event.getById(eventId);
      if (!event) return res.status(404).json({ message: 'Event not found' });
  
      // Check if the current organizer owns this event
      if (event.user_id !== req.user_id) {
        return res.status(403).json({ message: 'You can only delete your own events' });
      }
  
      const deletedEvent = await Event.delete(eventId);
      
      res.status(200).json({ 
        message: 'Event deleted successfully',
        deletedEvent 
      });
    } catch (err) {
      res.status(500).json({ 
        message: 'Failed to delete event',
        error: err.message 
      });
    }
  };

exports.getEventsByID = async (req, res) => {
    const eventId = req.params.eventId;
  
    try {
      const event = await Event.getById(eventId);
      res.status(200).json(event);
    } catch (err) {
      if (err.message === 'Event not found') {
        return res.status(404).json({ message: err.message });
      }
      res.status(500).json({ message: 'Failed to fetch event', error: err.message });
    }
  };
  
  