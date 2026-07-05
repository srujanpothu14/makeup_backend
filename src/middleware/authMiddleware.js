const authService = require('../services/authService');

const PUBLIC_PATHS = [
  /^\/health$/,
  /^\/services$/,
  /^\/services\/[^/]+$/,
  /^\/offers$/,
  /^\/offers\/[^/]+$/,
  /^\/gallery$/,
  /^\/reviews$/,
  /^\/settings$/,
  /^\/settings\/[^/]+$/,
];

function isPublicPath(path) {
  return PUBLIC_PATHS.some((pattern) => pattern.test(path));
}

async function authMiddleware(req, _res, next) {
  if (isPublicPath(req.path)) {
    next();
    return;
  }

  try {
    const user = await authService.getUserFromBearerToken(req.headers.authorization);
    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
}

module.exports = { authMiddleware };
