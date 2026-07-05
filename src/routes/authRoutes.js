const express = require('express');
const authController = require('../controllers/authController');
const { asyncHandler } = require('../utils/asyncHandler');
const { authMiddleware } = require('../middleware/authMiddleware');

const authRoutes = express.Router();

authRoutes.post('/auth/login', asyncHandler(authController.login));
authRoutes.post('/auth/register', asyncHandler(authController.register));
authRoutes.get('/auth/me', authMiddleware, asyncHandler(authController.me));
authRoutes.post('/auth/logout', authMiddleware, asyncHandler(authController.logout));

module.exports = { authRoutes };
