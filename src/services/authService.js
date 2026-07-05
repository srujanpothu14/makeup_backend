const bcrypt = require('bcrypt');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const env = require('../config/env');
const userRepository = require('../repositories/userRepository');
const { AppError } = require('../utils/appError');
const { normalizePhone } = require('../utils/phone');

function toClientUser(user) {
  const resolvedName = user.full_name || user.fullName || user.name || '';
  return {
    id: user.id,
    name: resolvedName,
    mobile_number: user.mobile_number,
    dateRegistered: user.dateRegistered,
  };
}

function createAccessToken(user) {
  return jwt.sign({ sub: user.id, phone: user.mobile_number }, env.jwtSecret, {
    expiresIn: '7d',
  });
}

async function login(input) {
  const phone = normalizePhone(input.phone || input.mobile_number || input.mobileNumber);
  const pin = String(input.pin || input.password || '');

  if (!/^\d{10}$/.test(phone) || !pin) {
    throw new AppError(400, 'Invalid credentials payload');
  }

  const user = await userRepository.findByMobileNumber(phone);
  if (!user || typeof user.password_hash !== 'string') {
    throw new AppError(401, 'Invalid credentials');
  }

  const matches = await bcrypt.compare(pin, user.password_hash);
  if (!matches) {
    throw new AppError(401, 'Invalid credentials');
  }

  return {
    token: createAccessToken(user),
    user: toClientUser(user),
  };
}

async function register(input) {
  const name = String(
    input.fullName || input.full_name || input.name || input.fullname || input.fullname || '',
  ).trim();
  const phone = normalizePhone(input.phone || input.mobile_number || input.mobileNumber);
  const rawPassword = String(
    input.password || input.pin || input.hashedpassowrd || input.hashedPassword || '',
  ).trim();

  if (!name) {
    throw new AppError(400, 'Name is required');
  }
  if (!/^\d{10}$/.test(phone)) {
    throw new AppError(400, 'Invalid mobile number');
  }
  if (!rawPassword) {
    throw new AppError(400, 'Password is required');
  }
  if (input.pin !== undefined && !/^\d{4}$/.test(String(input.pin))) {
    throw new AppError(400, 'PIN must be 4 digits');
  }

  const passwordHash = await bcrypt.hash(rawPassword, env.bcryptSaltRounds);

  const existingUser = await userRepository.findByMobileNumber(phone);
  if (existingUser) {
    throw new AppError(409, 'Mobile number already registered');
  }

  const newUser = {
    id: `u${crypto.randomUUID()}`,
    full_name: name,
    mobile_number: phone,
    password_hash: passwordHash,
    dateRegistered: new Date().toISOString(),
  };

  try {
    await userRepository.createUser(newUser);
  } catch (error) {
    if (error && error.name === 'ConditionalCheckFailedException') {
      throw new AppError(409, 'Mobile number already registered');
    }
    throw error;
  }

  return {
    token: createAccessToken(newUser),
    user: toClientUser(newUser),
  };
}

async function getUserFromBearerToken(authHeader) {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new AppError(401, 'Missing authorization token');
  }

  const token = authHeader.slice('Bearer '.length);
  let payload;

  try {
    payload = jwt.verify(token, env.jwtSecret);
  } catch (_error) {
    throw new AppError(401, 'Invalid or expired token');
  }

  const phone = normalizePhone(String(payload.phone || ''));
  if (!phone) {
    throw new AppError(401, 'Invalid token payload');
  }

  const user = await userRepository.findByMobileNumber(phone);
  if (!user) {
    throw new AppError(401, 'Invalid token user');
  }

  return user;
}

module.exports = {
  login,
  register,
  getUserFromBearerToken,
  toClientUser,
};
