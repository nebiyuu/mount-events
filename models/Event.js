const pool = require('../config/db');

class Event {

    //creating a new event
    static async create({ eventId, name, eventDetails, date, location, eventStatus,user_id: user_id }) {
        const query = `
          INSERT INTO events (eventId, name, eventDetails, date, location, eventStatus,user_id)
          VALUES ($1, $2, $3, $4, $5, $6,$7)
          RETURNING *;
        `;
        const values = [eventId, name, eventDetails, date, location, eventStatus,user_id];
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


  
static async update(eventId, { name, date, eventdetails, location, eventstatus }) {
  // Check if the event exists first
  const checkQuery = 'SELECT * FROM events WHERE eventId = $1';
  const { rows: eventRows } = await pool.query(checkQuery, [eventId]);

  if (eventRows.length === 0) {
    throw new Error('Event not found');
  }

  // Event exists, proceed with the update
  const query = `
    UPDATE events
    SET name = $1, eventDetails = $2, date = $3, location = $4, eventStatus = $5
    WHERE eventId = $6
    RETURNING *;
  `;
  const values = [name, eventdetails, date, location, eventstatus, eventId];
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

  static async getById(eventId) {
    const query = 'SELECT * FROM events WHERE eventId = $1';
    const { rows } = await pool.query(query, [eventId]);
    
    if (rows.length === 0) {
      throw new Error('Event not found');
    }
    
    return rows[0];
  }
}

module.exports = Event;