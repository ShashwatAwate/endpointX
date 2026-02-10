const pool = require("../db");

const getById = async (id) => {
  const result = await pool.query(
    "SELECT * FROM unit_tests WHERE question_id = $1",
    [id]
  );

  return result.rows[0];
};

module.exports = {
  getById,
};
