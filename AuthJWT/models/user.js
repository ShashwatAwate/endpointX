
const pool = require('../db');   // postgres connection
const bcrypt = require('bcrypt');

class User {

  static async create(name, email, password) {

    const hashed = await bcrypt.hash(password, 10);

    const result = await pool.query(
      `INSERT INTO users (name, email, password)
       VALUES ($1, $2, $3) RETURNING id, name, email`,
      [name, email, hashed]
    );

    return result.rows[0];
  }


  static async findByEmail(email) {
    const result = await pool.query(
      `SELECT * FROM users WHERE email = $1`,
      [email]
    );

    return result.rows[0];
  }


  static async comparePassword(plain, hashed) {
    return bcrypt.compare(plain, hashed);
  }

}

module.exports = User;
