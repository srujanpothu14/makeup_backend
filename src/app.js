const express = require('express');
const path = require('path');
const cors = require('cors');
const env = require('./config/env');
const { createApiRouter } = require('./routes/apiRouter');
const { AppError } = require('./utils/appError');

const app = express();

app.use(cors({ origin: env.corsOrigin, credentials: true }));
app.use(express.json());
app.use('/admin', express.static(path.join(__dirname, '../..', 'makeup_admin')));

app.use('/', createApiRouter());
app.use('/api', createApiRouter());

app.use((req, _res, next) => {
  next(new AppError(404, `Route not found: ${req.method} ${req.path}`));
});

app.use((error, _req, res, _next) => {
  const status = Number(error.status || 500);
  const message =
    typeof error.message === 'string' && error.message.trim().length
      ? error.message
      : 'Internal server error';

  if (status >= 500) {
    console.error(error);
  }

  res.status(status).json({ message });
});

module.exports = { app };
