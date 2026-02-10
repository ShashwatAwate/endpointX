
const bcrypt = require('bcrypt');

let pool = null;
try {
  // optional DB; if not present we'll fall back to an in-memory store
  // require('../db') should export a `query` function like pg Pool
  // keep this in a try/catch so the module is usable without a DB configured
  // (useful for local development / tests).
  // eslint-disable-next-line global-require
  pool = require('../db');
} catch (e) {
  pool = null;
}

class User {
  static async create(name, email, password) {
    const hashed = await bcrypt.hash(password, 10);
    if (pool && typeof pool.query === 'function') {
      const result = await pool.query(
        `INSERT INTO users (name, email, password)
         VALUES ($1, $2, $3) RETURNING id, name, email`,
        [name, email, hashed]
      );
      return result.rows[0];
    }

    // In-memory fallback
    if (!global.__users) global.__users = [];
    const id = (global.__users.length + 1).toString();
    const user = { id, name, email, password: hashed };
    global.__users.push(user);
    return { id: user.id, name: user.name, email: user.email, password: user.password };
  }

  static async findByEmail(email) {
    if (pool && typeof pool.query === 'function') {
      const result = await pool.query(`SELECT * FROM users WHERE email = $1`, [email]);
      return result.rows[0];
    }

    if (!global.__users) global.__users = [];
    return global.__users.find((u) => u.email === email) || null;
  }

  static async comparePassword(plain, hashed) {
    return bcrypt.compare(plain, hashed);
  }
}

module.exports = User;
