// server/auth/service.js

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../db');

async function signup(email, password, nickname) {
  const hash = await bcrypt.hash(password, 10);
  return pool.query(
    'INSERT INTO users (email, password, nickname) VALUES ($1, $2, $3) RETURNING id',
    [email, hash, nickname]
  );
}

async function login(email, password) {
  const res = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
  const user = res.rows[0];
  if (!user) throw new Error('Invalid credentials');
  const match = await bcrypt.compare(password, user.password);
  if (!match) throw new Error('Invalid credentials');
  return jwt.sign({ id: user.id }, process.env.JWT_SECRET);
}

module.exports = { signup, login };
