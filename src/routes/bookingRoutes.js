const express = require('express');
const bookingController = require('../controllers/bookingController');
const { asyncHandler } = require('../utils/asyncHandler');
const { authMiddleware } = require('../middleware/authMiddleware');

const bookingRoutes = express.Router();

/**
 * @openapi
 * /bookings:
 *   post:
 *     summary: Create a booking
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               customerId:
 *                 type: string
 *               customerName:
 *                 type: string
 *               customerPhone:
 *                 type: string
 *               services:
 *                 type: array
 *                 items:
 *                   type: string
 *               bookingDate:
 *                 type: string
 *               bookingTime:
 *                 type: string
 *     responses:
 *       201:
 *         description: Booking created
 */
bookingRoutes.post('/bookings', authMiddleware, asyncHandler(bookingController.createBooking));

/**
 * @openapi
 * /bookings/customer/{userId}:
 *   get:
 *     summary: List bookings for a customer
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of customer bookings
 */
bookingRoutes.get(
  '/bookings/customer/:userId',
  authMiddleware,
  asyncHandler(bookingController.listCustomerBookings),
);

/**
 * @openapi
 * /bookings:
 *   get:
 *     summary: List bookings
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: userId
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of bookings
 */
bookingRoutes.get('/bookings', authMiddleware, asyncHandler(bookingController.listBookings));

module.exports = { bookingRoutes };
