const authService = require('../services/authService');
const { AppError } = require('../utils/appError');

async function login(req, res) {
  const result = await authService.login(req.body || {});
  res.json(result);
}

async function register(req, res) {
  const result = await authService.register(req.body || {});
  res.status(201).json(result);
}

async function me(req, res) {
  res.json(authService.toClientUser(req.user));
}

async function logout(_req, res) {
  res.json({ message: 'Logged out' });
}

module.exports = {
  login,
  register,
  me,
  logout,
};
