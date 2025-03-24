const pool = require('../config/db');
const bcrypt = require('bcryptjs');

class User {

  static async create({ username, userpassword }) {
    const hashedPassword = await bcrypt.hash(userpassword, 10);
    const query = `
      INSERT INTO users (username, userpassword)
      VALUES ($1, $2)
      RETURNING id;  -- This will return the user_id of the newly created user
    `;
    const values = [username, hashedPassword];
    
    // Run the query and get the rows (which now includes the user_id)
    const { rows } = await pool.query(query, values);
    
    // Return the first row, which should contain the user_id as 'id'
    return rows[0]; // This should contain 'id' or 'user_id'
  }


  static async findByUsername(username) {
    const query = 'SELECT * FROM users WHERE username = $1';
    const { rows } = await pool.query(query, [username]);
    console.log(rows[0]);
    return rows[0];

  }

  static async comparePasswords(candidatePassword, hashedPassword) {
    return await bcrypt.compare(candidatePassword, hashedPassword);
  }
}

module.exports = User;