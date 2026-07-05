const crypto = require('crypto');
const bookingRepository = require('../repositories/bookingRepository');
const { normalizePhone } = require('../utils/phone');
const { AppError } = require('../utils/appError');

async function createBooking(req, res) {
  const customerId = String(req.body.customerId || req.user.id || '');
  const customerName = String(req.body.customerName || '').trim();
  const customerPhone = normalizePhone(req.body.customerPhone || '');
  const serviceIds = Array.isArray(req.body.services) ? req.body.services.map(String) : [];
  const bookingDate = String(req.body.bookingDate || '').trim();
  const bookingTime = String(req.body.bookingTime || '').trim();

  if (!customerId) {
    throw new AppError(400, 'customerId is required');
  }

  const bookingId = `booking_${crypto.randomUUID()}`;

  const booking = {
    booking_id: bookingId,
    customerId,
    customerName,
    customerPhone,
    services: serviceIds,
    bookingDate,
    bookingTime,
    status: 'pending',
    createdAt: new Date().toISOString(),
  };

  await bookingRepository.createBooking(booking);
  res.status(201).json(booking);
}

async function listCustomerBookings(req, res) {
  const userId = String(req.params.userId || '');
  const bookings = await bookingRepository.listBookings();
  const userBookings = bookings.filter((entry) => entry.customerId === userId);
  res.json(userBookings);
}

async function listBookings(req, res) {
  const userId = String(req.query.userId || '');
  const bookings = await bookingRepository.listBookings();
  if (!userId) {
    res.json(bookings);
    return;
  }

  const userBookings = bookings.filter((entry) => entry.customerId === userId);
  res.json(userBookings);
}

module.exports = {
  createBooking,
  listCustomerBookings,
  listBookings,
};
