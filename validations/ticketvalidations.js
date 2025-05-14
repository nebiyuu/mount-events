
const Joi = require('joi');

// Create Ticket Type
const createTicketTypeSchema = Joi.object({
  event_id: Joi.number().integer().required(),
  type: Joi.string().required(),
  price: Joi.number().positive().required(),
  start_date: Joi.date().required(),
  end_date: Joi.date().greater(Joi.ref('start_date')).required(),
  quantity: Joi.number().integer().min(1).required()
});

// Get Ticket Type by ID
const getTicketTypeByIdSchema = Joi.object({
  id: Joi.number().integer().required()
});

// Update Ticket Type
const updateTicketTypeSchema = Joi.object({
  id: Joi.number().integer().required(),
  body: Joi.object({
    type: Joi.string().optional(),
    price: Joi.number().positive().optional(),
    start_date: Joi.date().optional(),
    end_date: Joi.date().greater(Joi.ref('start_date')).optional(),
    quantity: Joi.number().integer().min(1).optional(),
    is_active: Joi.boolean().optional()
  })
});

// Delete Ticket Type
const deleteTicketTypeSchema = Joi.object({
  id: Joi.number().integer().required()
});

// Get All Ticket Types for an Event
const getAllTicketTypesForEventSchema = Joi.object({
  event_id: Joi.number().integer().required()
});

// Purchase Ticket
const purchaseTicketSchema = Joi.object({
  ticket_type_id: Joi.number().integer().required(),
  quantity: Joi.number().integer().min(1).required(),
  discount_code: Joi.string().optional(),
  user_id: Joi.number().integer().required()
});

// Check Ticket Availability
const checkTicketAvailabilitySchema = Joi.object({
  id: Joi.number().integer().required()
});


const reserveTicketSchema = Joi.object({
    user_id: Joi.number().integer().required(),
    event_id: Joi.number().integer().required(),
    ticket_type_id: Joi.number().integer().required(),
    quantity: Joi.number().integer().min(1).required(),
  });

module.exports = {
  createTicketTypeSchema,
  getTicketTypeByIdSchema,
  updateTicketTypeSchema,
  deleteTicketTypeSchema,
  getAllTicketTypesForEventSchema,
  purchaseTicketSchema,
  checkTicketAvailabilitySchema,
  reserveTicketSchema
};
