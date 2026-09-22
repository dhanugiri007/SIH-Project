const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const env = require('../config/env');

function generateToken(userId, role) {
  return jwt.sign({ id: userId, role }, env.jwtSecret, { expiresIn: env.jwtExpiresIn });
}

async function hashPassword(plainPassword) {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(plainPassword, salt);
}

module.exports = { generateToken, hashPassword };