const express = require('express');
const { createTicketType, getTicketTypeById, getAllTicketTypesForEvent, updateTicketType, deleteTicketType, purchaseTicket, checkTicketAvailability } = require('../../controller/ticketTypeController');

const router = express.Router();

// Ticket routes
router.post('/createTicket', createTicketType);
router.get('/getTicket/:id', getTicketTypeById);
router.get('/:event_id/ticket-types', getAllTicketTypesForEvent);
router.put('/updateTicket/:id', updateTicketType);
router.delete('/deleteTicket/:id', deleteTicketType);
router.get('/:id/availability', checkTicketAvailability);
router.post('/purchase-ticket',purchaseTicket);

module.exports = router;