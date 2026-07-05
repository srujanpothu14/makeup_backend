const express = require('express');
const bookingController = require('../controllers/bookingController');
const { asyncHandler } = require('../utils/asyncHandler');
const { authMiddleware } = require('../middleware/authMiddleware');

const bookingRoutes = express.Router();

bookingRoutes.post('/bookings', authMiddleware, asyncHandler(bookingController.createBooking));
bookingRoutes.get(
  '/bookings/customer/:userId',
  authMiddleware,
  asyncHandler(bookingController.listCustomerBookings),
);
bookingRoutes.get('/bookings', authMiddleware, asyncHandler(bookingController.listBookings));

module.exports = { bookingRoutes };
