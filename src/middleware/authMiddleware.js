const authService = require('../services/authService');

async function authMiddleware(req, _res, next) {
  try {
    const user = await authService.getUserFromBearerToken(req.headers.authorization);
    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
}

module.exports = { authMiddleware };
