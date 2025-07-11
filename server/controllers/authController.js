const { signup, login } = require('../auth/service');

async function handleSignup(req, res) {
  try {
    const { email, password, nickname } = req.body;
    const result = await signup(email, password, nickname);
    res.status(201).json({ id: result.rows[0].id });
  } catch (err) {
    res.status(400).json({ error: 'User already exists' });
  }
}

async function handleLogin(req, res) {
  try {
    const token = await login(req.body.email, req.body.password);
    res.json({ token });
  } catch {
    res.status(401).json({ error: 'Invalid credentials' });
  }
}

module.exports = { handleSignup, handleLogin };
