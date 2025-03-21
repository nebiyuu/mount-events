const express = require('express');
const app = express();
app.use(express.json()); 
require('dotenv').config();
//console.log('JWT_SECRET:', process.env.JWT_SECRET);

const authRoutes = require('./routes/login');
const eventRoutes = require('./routes/events');
app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);


app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
  });
 