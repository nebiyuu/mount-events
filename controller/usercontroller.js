const User = require('../models/User');
const Organizer = require('../models/Organizer');
const express = require('express');
const jwt = require('jsonwebtoken');
const authOrganizer = require('../middleware/authOrganizer');

exports.registerOrganizer = async (req, res) => {
    const { username, userpassword, company_phone_number, company_logo, company_name, tin_number, bank_name, bank_account_number, business_license_path } = req.body;
    const role ='Organizer'
    try {
      // Check if the username already exists
      const existingUser = await User.findByUsername(username);
      if (existingUser) {
        return res.status(400).json({ message: 'Username already exists' });
      }
      
      // Create a new user
      const user = await User.create({ username, userpassword,role});
      
      // Log the created user object for debugging
      console.log('Created user:', user);
      
      if (!user || !user.id) { // Ensure user.id is available
        return res.status(500).json({ message: 'User creation failed. No ID returned.' });
      }
      
      // Create a new organizer entry using the user_id
      const organizer = await Organizer.create({
        user_id: user.id, // Use user.id here, since that's the field returned
        company_phone_number,
        company_logo, 
        company_name,
        tin_number,
        bank_name,
        bank_account_number,
        business_license_path
      });
  
      res.status(201).json({ user, organizer });
    } catch (err) {
      console.error(err); // Log the error for debugging
      res.status(400).json({ message: 'Registration failed', error: err.message });
    }
  };

  exports.registerAttendee = async(req,res)=>{
    const { username, userpassword } = req.body; 
  
    try {
      // Check if the username already exists
      const existingUser = await User.findByUsername(username);
      if (existingUser) {
        return res.status(400).json({ message: 'Username already exists' });
      }
      
      // Create a new user
      const user = await User.create({ username, userpassword });
      
      // Log the created user object for debugging
      console.log('Created user:', user);
      res.status(201).json({ user});
  
    }
    catch (err) {
      console.error(err); // Log the error for debugging
      res.status(400).json({ message: 'Registration failed', error: err.message });
    }
  };


exports.login = async (req, res) => {
    const { username, userpassword } = req.body; 
    
    try {
      // 1. Find user
      const user = await User.findByUsername(username);
      if (!user) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }
  
      // 2. Compare passwords
      const isMatch = await User.comparePasswords(userpassword, user.userpassword);
      console.log(user.role);
      if (!isMatch) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }
  
      // 3. Generate JWT
      const token = jwt.sign(
        { userId: user.id, username: user.username, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );
  
      // 4. Send response (omit password in response)
      const { userpassword: _, ...userWithoutPassword } = user;
      res.json({ token, user: userWithoutPassword });
      
    } catch (err) {
      console.error('Login error:', err);
      res.status(500).json({ 
        message: 'Login failed',
        error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
      });
    }
  };

exports.updateOrganizer = async (req, res) => {
    const { userId } = req.params;
    const  organizerData = req.body;

    try {
        // Find the organizer by user_id
        const organizer = await Organizer.findById(userId);
        if (!organizer) {
            return res.status(404).json({ message: 'Organizer not found' });
        }
       // console.log(vaar);
        // Update the organizer's details
        await Organizer.update(userId, organizerData);

        res.status(200).json({ message: 'Organizer updated successfully', organizer });
    } catch (err) {
        console.error('Error updating organizer:', err);
        res.status(500).json({ message: 'Failed to update organizer', error: err.message });
    }

  };
exports.updateAttendee = async (req, res) => {
    const { userId } = req.params;
    const attendeeData = req.body;

    try {
        // Find the attendee by user_id
        const attendee = await User.findById(userId);
        if (!attendee) {
            return res.status(404).json({ message: 'Attendee not found' });
        }

        // Update the attendee's details
        await User.update(userId, attendeeData);

        res.status(200).json({ message: 'Attendee updated successfully', attendee });
    } catch (err) {
        console.error('Error updating attendee:', err);
        res.status(500).json({ message: 'Failed to update attendee', error: err.message });
    }
  }
