const Joi = require("joi");

const createEventSchema = Joi.object({
    title: Joi.string().min(1).required(),
    description: Joi.string().min(1).required(),
    date: Joi.date().greater('now').required(), //date must be in the future
    start_time: Joi.date().greater(Joi.ref('date')).required(), //start time must be after the event date
    end_time: Joi.date().greater(Joi.ref('start_time')).required(), //end time must be after starting time
    location: Joi.required(),
    capacity: Joi.number().integer().min(0).required(),  //to insure the capacity is non-negative number
    image: Joi.optional()
});

module.exports = createEventSchema;