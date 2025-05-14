const Joi = require('joi');

const createDiscountSchema = Joi.object({
  code: Joi.string().required(),
  discount_type: Joi.string().valid('percentage', 'fixed').required(),
  value: Joi.number().positive().required(),

  start_date: Joi.date().required(),
  end_date: Joi.date().greater(Joi.ref('start_date')).required(),

  usage_limit: Joi.number().integer().min(1).optional(),

  event_id: Joi.number().integer(),
  ticket_type_id: Joi.number().integer().optional().allow(null),
});

module.exports = {
  createDiscountSchema,
};
