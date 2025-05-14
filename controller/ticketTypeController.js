const { pool } = require("../config/db.js");
const {
  createTicketTypeSchema,
  getTicketTypeByIdSchema,
  updateTicketTypeSchema,
  deleteTicketTypeSchema,
  getAllTicketTypesForEventSchema,
  purchaseTicketSchema,
  checkTicketAvailabilitySchema,
} = require("../validations/ticketvalidations.js");

// Create Ticket Type
const createTicketType = async (req, res) => {

  const { error } = createTicketTypeSchema.validate(req.body);
  if(error){
    return res.status(400).json({error: error.details[0].message });
  }

  const { event_id, type, price, start_date, end_date, quantity } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO ticket_type (event_id, type, price, start_date, end_date, quantity) 
             VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [event_id, type, price, start_date, end_date, quantity]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Get Ticket Type by ID
const getTicketTypeById = async (req, res) => {

  const { error } = getTicketTypeByIdSchema.validate(req.params);
  if(error){
    return res.status(400).json({error: error.details[0].message });
  }

  const { id } = req.params;

  try {
    const result = await pool.query(
      `SELECT * FROM ticket_type WHERE ticket_type_id = $1`,
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Ticket type not found" });
    }
    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Update Ticket Type
const updateTicketType = async (req, res) => {

  const { error } = updateTicketTypeSchema.validate({
    id: req.params.id,
    body: req.body
  });
  if(error){
    return res.status(400).json({error: error.details[0].message });
  }

  const { id } = req.params;
  const { type, price, start_date, end_date, quantity, is_active } = req.body;

  try {
    const result = await pool.query(
      `UPDATE ticket_type SET type = $1, price = $2, start_date = $3, end_date = $4, quantity = $5, is_active = $6 
             WHERE ticket_type_id = $7 RETURNING *`,
      [type, price, start_date, end_date, quantity, is_active, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Ticket type not found" });
    }
    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Delete Ticket Type
const deleteTicketType = async (req, res) => {

  const { error } = deleteTicketTypeSchema.validate(req.params);
  if(error){
    return res.status(400).json({error: error.details[0].message });
  }

  const { id } = req.params;

  try {
    const result = await pool.query(
      `DELETE FROM ticket_type WHERE ticket_type_id = $1 RETURNING *`,
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Ticket type not found" });
    }
    res.status(204).send(); // No content response
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Get All Ticket Types for an Event
const getAllTicketTypesForEvent = async (req, res) => {

  const { error } = getAllTicketTypesForEventSchema.validate(req.params);
  if(error){
    return res.status(400).json({error: error.details[0].message });
  }

  const { event_id } = req.params;
  try {
    const result = await pool.query(
      `SELECT * FROM ticket_type WHERE event_id = $1`,
      [event_id]
    );
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Purchase Ticket

const purchaseTicket = async (req, res) => {

  const { error } = purchaseTicketSchema.validate(req.body);
  if(error){
    return res.status(400).json({error: error.details[0].message });
  }

  const { ticket_type_id, quantity, discount_code, user_id } = req.body;
  //const user_id = req.user?.user_id; // Authenticated user ID (from middleware)

  //  Ensure user is logged in
  // if (!user_id) {
  //   return res.status(401).json({ error: "User not authenticated" });
  // }

  try {
    // Get ticket details (price, quantity, event it belongs to)
    const ticketRes = await pool.query(
      `SELECT price, quantity, event_id FROM ticket_type WHERE ticket_type_id = $1`,
      [ticket_type_id]
    );

    if (ticketRes.rows.length === 0) {
      return res.status(404).json({ error: "Ticket type not found" });
    }

    const ticket = ticketRes.rows[0];

    // Check availability
    if (ticket.quantity < quantity) {
      return res.status(400).json({
        error: `Only ${ticket.quantity} tickets available`,
      });
    }

    //Handle discount logic
    let discount = 0;
    let discountInfo = null;
    const now = new Date();

    if (discount_code) {
      const discountRes = await pool.query(
        `SELECT * FROM discount_codes 
         WHERE code = $1 AND start_date <= $2 AND end_date >= $2`,
        [discount_code, now]
      );

      if (discountRes.rows.length > 0) {
        const d = discountRes.rows[0];

        const isEventMatch = !d.event_id || d.event_id === ticket.event_id;
        const isTicketMatch =
          !d.ticket_type_id || d.ticket_type_id === ticket_type_id;
        const isUsageOk = !d.usage_limit || d.usage_count < d.usage_limit;

        if (isEventMatch && isTicketMatch && isUsageOk) {
          // Apply discount
          if (d.discount_type === "percentage") {
            discount = (ticket.price * d.value) / 100;
          } else if (d.discount_type === "fixed") {
            discount = d.value;
          }

          discountInfo = d;

          // Update usage count immediately or maybe delay until after payment confirmation)
          await pool.query(
            `UPDATE discount_codes SET usage_count = usage_count + 1 WHERE discount_id = $1`,
            [d.discount_id]
          );
        }
      }
    }

    // Calculate prices
    const originalPrice = ticket.price * quantity;
    const totalDiscount = discount * quantity;
    const finalPrice = originalPrice - totalDiscount;

    //PAYMENT GATEWAY INTEGRATION

    // payment success (for testing)
    const paymentSuccess = true; // going to be Replaced with actual gateway result
    if (!paymentSuccess) {
      return res.status(400).json({ error: "Payment failed or was cancelled" });
    }

    //Deduct ticket quantity
    const newQuantity = ticket.quantity - quantity;
    await pool.query(
      `UPDATE ticket_type SET quantity = $1 WHERE ticket_type_id = $2`,
      [newQuantity, ticket_type_id]
    );

    // Record purchase
    await pool.query(
      `INSERT INTO purchases 
        (user_id, ticket_type_id, quantity, purchase_date, discount_code, total_price)
       VALUES ($1, $2, $3, NOW(), $4, $5)`,
      [user_id, ticket_type_id, quantity, discount_code || null, finalPrice]
    );

    //update reservation if reserved befor

    const reserv = await pool.query(
      `SELECT * FROM reservations WHERE user_id = $1 AND ticket_type_id = $2`,
      [user_id, ticket_type_id]
    );

    const reservation = reserv.rows[0];

    if (reservation && reservation.status === "reserved") {
      await pool.query(
        `UPDATE reservations 
         SET status = 'paid'
         WHERE reservation_id = $1`,
        [reservation.reservation_id]
      );
    }

    // Respond to user
    res.status(200).json({
      message: "Tickets purchased successfully",
      originalPrice,
      discountPerTicket: discount,
      totalDiscount,
      finalPrice,
      discountCode: discountInfo?.code || null,
    });
  } catch (error) {
    console.error("Purchase Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Check Ticket Availability
const checkTicketAvailability = async (req, res) => {

  const { error } = checkTicketAvailabilitySchema.validate(req.params);
  if(error){
    return res.status(400).json({error: error.details[0].message });
  }

  const { id } = req.params;
  try {
    const result = await pool.query(
      `SELECT quantity FROM ticket_type WHERE ticket_type_id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Ticket type not found" });
    }
    res.json({
      available: result.rows[0].quantity > 0,
      quantity: result.rows[0].quantity,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  createTicketType,
  getAllTicketTypesForEvent,
  getTicketTypeById,
  updateTicketType,
  deleteTicketType,
  checkTicketAvailability,
  purchaseTicket,
};
