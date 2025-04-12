const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Organizer = require('../models/Organizer');
const jwt = require('jsonwebtoken');



//to register organizer
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


//too register attendee
router.post('/register/attendee',async(req,res)=>{
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
})

//to login all users
router.post('/login', async (req, res) => {
  const { username, userpassword } = req.body; 
  
  try {
    // 1. Find user
    const user = await User.findByUsername(username);
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // 2. Compare passwords
    const isMatch = await User.comparePasswords(userpassword, user.userpassword);
    console.log(user);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // 3. Generate JWT
    const token = jwt.sign(
      { userId: user.id, username: user.username },
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
});

module.exports = router;