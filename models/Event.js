const pool = require('../config/db');

class Event {

    //creating a new event
    static async create({ eventId, name, eventDetails, date, location, eventStatus }) {
        const query = `
          INSERT INTO events (eventId, name, eventDetails, date, location, eventStatus)
          VALUES ($1, $2, $3, $4, $5, $6)
          RETURNING *;
        `;
        const values = [eventId, name, eventDetails, date, location, eventStatus];
        console.log(eventId);
      
        try {
          const { rows } = await pool.query(query, values);
          return rows[0];
        } catch (error) {
          console.error('Error in create method:', error); // Log the error
          throw error; // Re-throw the error to handle it in the route
        }
      }

  static async findByEventId(eventId) {
    const query = 'SELECT * FROM events WHERE eventId = $1';
    const { rows } = await pool.query(query, [eventId]);
    return rows[0];
  }


  
  static async update(eventId, { name, date,eventDetails, location, eventStatus  }) {
    const query = `
      UPDATE events
      SET name = $1, eventDetails = $2,data =$3, location = $4, eventStatus = $5,
      WHERE eventId = $6
      RETURNING *;
    `;
    const values = [name,eventDetails, date, location, eventStatus, eventId];
    const { rows } = await pool.query(query, values);
    return rows[0];
  }

  static async delete(eventId) {
    const query = 'DELETE FROM events WHERE eventId = $1 RETURNING *';
    const { rows } = await pool.query(query, [eventId]);
    return rows[0];
  }

  static async getAll() {
    const query = 'SELECT * FROM events';
    const { rows } = await pool.query(query);
    return rows;
  }
}

module.exports = Event;