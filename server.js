const express = require('express');
const cron = require('node-cron');
const authRoutes = require('./routes/login');
const eventRoutes = require('./routes/events');
const allTicketRoutes = require('./routes/ticketRoutes/ticketRoutes');
const reservationRoutes = require('./routes/ticketRoutes/reservation');
const expireReservations = require('./utills/expireReservations');
const createDiscount = require('./routes/discountRoutes/discountRoutes');
require('dotenv').config();

const app = express();

app.use(express.json()); 

app.get('/home', (req, res) =>{
  res.send("WELCOME TO THE EVENT MANAGEMENT API")
});
//console.log('JWT_SECRET:', process.env.JWT_SECRET);
//console.log('eventId:');

app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/ticket', allTicketRoutes);
app.use('/api/ticket', reservationRoutes);

app.use('api/admin/discount', createDiscount);

cron.schedule('0 * * * *', () => {
  console.log("Running reservation expiry check...");
  expireReservations();
})

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    //console.log('Server is running on http://localhost:3000');
    console.log(`Server running on port ${PORT}`);
  });
 