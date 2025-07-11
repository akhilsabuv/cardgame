const { getUserById } = require('../models/userModel');

async function handleGetMe(req, res) {
  const user = await getUserById(req.user.id);
  res.json(user);
}

module.exports = { handleGetMe };
