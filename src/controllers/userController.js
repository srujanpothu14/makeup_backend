const bcrypt = require('bcrypt');
const env = require('../config/env');
const userRepository = require('../repositories/userRepository');
const { AppError } = require('../utils/appError');
const { normalizePhone } = require('../utils/phone');

function normalizeUser(item) {
  const candidate = item || {};
  return {
    id: String(candidate.id ?? ''),
    full_name: String(candidate.full_name ?? candidate.fullName ?? candidate.name ?? ''),
    mobile_number: String(candidate.mobile_number ?? candidate.mobileNumber ?? ''),
    dateRegistered: String(candidate.dateRegistered ?? ''),
  };
}

async function listUsers(_req, res) {
  const users = await userRepository.listUsers();
  res.json(users.map(normalizeUser));
}

async function getUserByMobileNumber(req, res) {
  const mobile = normalizePhone(req.params.mobileNumber || '');
  if (!/^[0-9+]+$/.test(mobile)) {
    throw new AppError(400, 'Invalid mobile number');
  }

  const user = await userRepository.findByMobileNumber(mobile);
  if (!user) {
    throw new AppError(404, 'User not found');
  }
  res.json(normalizeUser(user));
}

async function updateUser(req, res) {
  const mobile = normalizePhone(req.params.mobileNumber || '');
  if (!/^[0-9+]+$/.test(mobile)) {
    throw new AppError(400, 'Invalid mobile number');
  }

  const body = req.body || {};
  const updates = {};

  if (body.full_name !== undefined || body.name !== undefined) {
    updates.full_name = String(body.full_name ?? body.name);
  }
  if (body.password !== undefined) {
    if (!String(body.password).trim()) {
      throw new AppError(400, 'Password cannot be empty');
    }
    updates.password_hash = await bcrypt.hash(String(body.password), env.bcryptSaltRounds);
  }

  if (Object.keys(updates).length === 0) {
    throw new AppError(400, 'No user fields provided for update');
  }

  const updated = await userRepository.updateUser(mobile, updates);
  if (!updated) {
    throw new AppError(404, 'User not found');
  }
  res.json(normalizeUser(updated));
}

async function deleteUser(req, res) {
  const mobile = normalizePhone(req.params.mobileNumber || '');
  if (!/^[0-9+]+$/.test(mobile)) {
    throw new AppError(400, 'Invalid mobile number');
  }
  await userRepository.deleteUser(mobile);
  res.json({ message: 'User deleted' });
}

module.exports = {
  listUsers,
  getUserByMobileNumber,
  updateUser,
  deleteUser,
};
