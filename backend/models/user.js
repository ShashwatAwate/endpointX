
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
  static async create(id, name, email, password) {
    console.log('=== USER.CREATE DEBUG ===');
    console.log('Received parameters:');
    console.log('- id:', id, typeof id);
    console.log('- name:', name, typeof name);
    console.log('- email:', email, typeof email);
    console.log('- password:', password ? '[HIDDEN]' : 'undefined', typeof password);
    
    const hashed = await bcrypt.hash(password, 10);
    console.log('- hashed password length:', hashed ? hashed.length : 'null');
    
    if (pool && typeof pool.query === 'function') {
      console.log('Using database...');
      console.log('Query params:', [id, name, email, '[HIDDEN HASH]']);
      
      const result = await pool.query(
        `INSERT INTO users (id, name, email, password)
         VALUES ($1, $2, $3, $4) RETURNING id, name, email`,
        [id, name, email, hashed]
      );
      console.log('Database result:', result.rows[0]);
      return result.rows[0];
    }

    // In-memory fallback
    if (!global.__users) global.__users = [];
    // const id = (global.__users.length + 1);
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
