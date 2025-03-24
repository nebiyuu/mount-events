const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Organizer = require('../models/Organizer');
const jwt = require('jsonwebtoken');


router.post('/register/organizer', async (req, res) => {
  const { username, userpassword, company_phone_number, company_logo, company_name, tin_number, bank_name, bank_account_number, business_license_path } = req.body;
  
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
});



router.post('/login', async (req, res) => {
  const { username, userpassword } = req.body;
  //console.log(username, userpassword); // Debugging line
  try {
    const user = await User.findByUsername(username);
    if (!user || !(await User.comparePasswords(userpassword, user.userpassword))) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: '1h', // Optional: Set token expiration
    });
    res.json({ token });
  } catch (err) {
    res.status(500).json({ message: 'Login failed', error: err.message });
  }
});

module.exports = router;