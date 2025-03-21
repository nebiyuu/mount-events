const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Register
router.post('/register', async (req, res) => {
  const { username, userpassword } = req.body;
  try {
    const user = await User.create({ username, userpassword });
    res.status(201).json(user);
  } catch (err) {
    res.status(400).json({ message: 'Registration faiiiled', error: err.message });
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