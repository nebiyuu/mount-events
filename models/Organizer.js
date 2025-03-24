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
}

module.exports = Organizer;
