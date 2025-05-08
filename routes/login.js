const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Organizer = require('../models/Organizer');
const jwt = require('jsonwebtoken');
const authOrganizer = require('../middleware/authOrganizer');
const userController = require('../controller/usercontroller')

//to register organizer
router.post('/register/organizer',userController.registerOrganizer)

//to register attendee
router.post('/register/attendee',userController.registerAttendee)

//to login all usersegister/attendee
router.post('/login',userController.login)

//update attendee profile
router.put('/update-attendee/::userId',authOrganizer,userController.updateAttendee)

//update organizer
router.put('/update-organizer/:userId',authOrganizer,userController.updateOrganizer)

//delete attendee
router.delete('/delete-attendee/:userId', authOrganizer, userController.deleteattendee)

//delete organizer
router.delete('/delete-organizer/:userId', authOrganizer, userController.deleteorganizer)

module.exports = router;