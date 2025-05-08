const pool = require('../config/db');


class Organizer {
  static async create({ user_id, company_phone_number, company_logo, company_name, tin_number, bank_name, bank_account_number, business_license_path }) {
    const query = `
      INSERT INTO organizers (
        user_id, company_phone_number, company_logo, company_name, tin_number, 
        bank_name, bank_account_number, business_license_path
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *;
    `;
    const values = [user_id, company_phone_number, company_logo, company_name, tin_number, bank_name, bank_account_number, business_license_path];
    
    try {
      const result = await pool.query(query, values);
      return result.rows[0]; // This will return the newly created organizer record
    } catch (err) {
      throw new Error(err.message); // If something goes wrong, throw an error with the message
    }
  }


  static async update(user_id, {company_phone_number, company_logo, company_name, tin_number, bank_name, bank_account_number, business_license_path }) {

    // Check if the event exists first
  const checkQuery = 'SELECT * FROM organizers WHERE user_id = $1';
  const { rows: eventRows } = await pool.query(checkQuery, [user_id]);

  if (eventRows.length === 0) {
    throw new Error('Event not found');
  }

    // user exists, proceed with the update
    const query = `
      UPDATE organizers
      SET company_phone_number= $1, company_logo= $2, company_name = $3, tin_number= $4, bank_name = $5, bank_account_number= $6, business_license_path= $7
      WHERE user_id = $8 
      RETURNING *;
    `;
    const values = [company_phone_number, company_logo, company_name, tin_number, bank_name, bank_account_number, business_license_path , user_id];
    const { rows } = await pool.query(query, values);
    return rows[0];
  }



  static async findById(user_id) {
    try {
        const query = 'SELECT * FROM organizers WHERE user_id = $1';
        const { rows } = await pool.query(query, [user_id]);
        return rows[0] || null;
    } catch (error) {
        throw error;
    }
}
}

module.exports = Organizer;


