const pool = require('../db');

async function findByEmail(email) {
  const res = await pool.query(
    'SELECT * FROM users WHERE email = $1',
    [email]
  );
  return res.rows[0];
}

async function createUser(email, hash, nickname) {
  const res = await pool.query(
    'INSERT INTO users (email, password, nickname) VALUES ($1, $2, $3) RETURNING id, email, nickname',
    [email, hash, nickname]
  );
  return res.rows[0];
}

async function getUserById(id) {
  const res = await pool.query(
    'SELECT id, email, nickname, coins, power_points FROM users WHERE id = $1',
    [id]
  );
  return res.rows[0];
}

module.exports = { findByEmail, createUser, getUserById };
