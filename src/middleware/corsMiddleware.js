const cors = require('cors');
const env = require('../config/env');

function createCorsMiddleware() {
  const allowedOrigins = env.corsOrigins;

  return cors({
    origin: env.corsAllowAll
      ? true
      : (origin, callback) => {
          if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
            return;
          }

          console.warn(`CORS blocked origin: ${origin}`);
          callback(null, false);
        },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
    exposedHeaders: ['Content-Length'],
    maxAge: 86400,
  });
}

module.exports = { createCorsMiddleware };
