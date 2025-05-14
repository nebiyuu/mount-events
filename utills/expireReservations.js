const { pool } = require('../config/db');

const expireReservations = async () => {
  try {
    const now = new Date();

    // 1. Get expired reservations
    const result = await pool.query(
      `SELECT * FROM reservations WHERE status = 'reserved' AND expiry_date <= $1`,
      [now]
    );

    const expiredReservations = result.rows;

    for (const resv of expiredReservations) {
      // 2. Mark reservation as expired
      await pool.query(
        `UPDATE reservations SET status = 'expired' WHERE reservation_id = $1`,
        [resv.reservation_id]
      );

      // 3. Return tickets back to availability
      await pool.query(
        `UPDATE ticket_type SET quantity = quantity + $1 WHERE ticket_type_id = $2`,
        [resv.quantity, resv.ticket_type_id]
      );

      console.log(`Reservation ${resv.reservation_id} expired and rolled back.`);
    }
  } catch (err) {
    console.error('Failed to expire reservations:', err);
  }
};

module.exports = expireReservations;
