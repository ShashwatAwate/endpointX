const pool = require('../db');

const getById = async (id) => {
  try {
    const result = await pool.query(
      "SELECT * FROM questions WHERE id = $1",
      [id]
    );

    return result.rows[0];   // returns full row

  } catch (err) {
    throw err;
  }
};

module.exports = {
  getById
};
