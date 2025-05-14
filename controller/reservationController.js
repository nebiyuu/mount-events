const { pool } = require("../config/db");
const { reserveTicketSchema } = require('../validations/ticketvalidations')

exports.reserveTicket = async (req, res) => {

  const { error } = reserveTicketSchema.validate(req.body);
  if(error){
    return res.status(400).json({error: error.details[0].message });
  }

  const { user_id, event_id, ticket_type_id, quantity } = req.body;

  try {
    // check the ticket and event relation
    const result = await pool.query(
      `SELECT * FROM ticket_type WHERE ticket_type_id = $1 AND event_id = $2`,
      [ticket_type_id, event_id]
    );

    if (result.rowCount <= 0) {
      return res
        .status(400)
        .json({ message: "ticket for that event doesn't exist! " });
    }

    //  Check if enough tickets are available
    // const ticketRes = await pool.query(
    //   "SELECT quantity FROM ticket_type WHERE ticket_type_id = $1",
    //   [ticket_type_id]
    // );

    const availableQty = result.rows[0].quantity;

    if (availableQty < quantity) {
      return res.status(400).json({ message: "Not enough tickets available" });
    }

    //  Reduce availability
    await pool.query(
      "UPDATE ticket_type SET quantity = quantity - $1 WHERE ticket_type_id = $2",
      [quantity, ticket_type_id]
    );

    //  Insert reservation with 24-hour expiry
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours from now
    
    // Just 1 minute for testing
    //const expiresAt = new Date(Date.now() + 1 * 60 * 1000);

    const reservationRes = await pool.query(
      `INSERT INTO reservations (user_id, event_id, ticket_type_id, quantity, expiry_date)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [user_id, event_id, ticket_type_id, quantity, expiresAt]
    );

    res.status(201).json({
      message: "Reservation successful!",
      reservation: reservationRes.rows[0],
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Reservation failed" });
  }
};
