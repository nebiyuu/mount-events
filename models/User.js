const pool = require('../config/db');
const bcrypt = require('bcryptjs');

class User {
  static async create({ username, userpassword }) {
    const hashedPassword = await bcrypt.hash(userpassword, 10);
    const query = `
      INSERT INTO users (username, userpassword)
      VALUES ($1, $2);
    `;
    const values = [username, hashedPassword];
    const { rows } = await pool.query(query, values);
    return rows[0];
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