const express = require('express');
const app = express();

// Middleware to parse JSON and form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// In-memory storage for username and password
let userData = {};

// Middleware to accept username and password (POST request)
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }

  // Store the data in memory
  userData = { username, password };

  // Send a success response
  res.json({ message: 'Login data received successfully!', userData });
});

// Middleware to display username and password (GET request)
app.get('/user', (req, res) => {
  if (!userData.username || !userData.password) {
    return res.status(404).json({ error: 'No user data found' });
  }

  // Send the stored data as a response
  res.json(userData);
});

// Start the server
app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});