const express = require('express');
const router = express.Router();
const { reserveTicket } = require('../../controller/reservationController');

router.post('/reservation', reserveTicket);

module.exports = router;