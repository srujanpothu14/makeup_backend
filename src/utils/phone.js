function normalizePhone(rawValue) {
  if (typeof rawValue !== 'string') {
    return '';
  }

  const digits = rawValue.replace(/\D/g, '');
  if (digits.length >= 10) {
    return digits.slice(-10);
  }

  return digits;
}

module.exports = { normalizePhone };
