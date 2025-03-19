const express = require('express');
const { Pool } = require('pg');
require('dotenv').config();
const app = express();

// Middleware to parse JSON and form data
app.use(express.json());
 
// PostgreSQL connection pool
const { Pool } = require('pg');

// PostgreSQL connection pool
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});


//checking if the connection was made
pool.connect((err, client, done) => {
    if (err) {
      console.error('Error connecting to PostgreSQL:', err.stack);
    } else {
      console.log('Successfully connected to PostgreSQL!');
      done(); // Release the client back to the pool
    }
  });

  
// Middleware to accept username and password and write to the `user` table (POST request)
app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }

  try {
    // Insert the user into the `user` table
    const query = 'select  INTO users (username, userpassword) VALUES ($1, $2) RETURNING *';
    const values = [username, password];
console.log("hereee");

    const result = await pool.query(query, values);
console.log("here");
    // Send a success response with the inserted user data
    res.json({ message: 'User data saved successfully!', user: result.rows[0] });
  } catch (err) {
    console.error('Error saving user data:', err);
    res.status(500).json({ error: 'Failed to save user data' });
  }
});

// Middleware to read all users from the `user` table (GET request)
app.get('/users', async (req, res) => {
  try {
    // Fetch all users from the `user` table
    const query = 'SELECT * FROM users';
    const result = await pool.query(query);

    // Send the fetched data as a response
    res.json({ users: result.rows });
  } catch (err) {
    console.error('Error fetching user data:', err);
    res.status(500).json({ error: 'Failed to fetch user data' });
  }
});

// Start the server
app.listen(4000, () => {
  console.log('Server is running on http://localhost:4000');
});

app.post('/login',(req,res)=>{

    const { username, password } = req.body;
    const query = 'SELECT * FROM users where username=username and userpassword = password';
    const result = pool.query(query);
    


})