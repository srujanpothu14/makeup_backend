const express = require('express');
const path = require('path');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerJSDoc = require('swagger-jsdoc');
const env = require('./config/env');
const { createApiRouter } = require('./routes/apiRouter');
const { AppError } = require('./utils/appError');

const app = express();

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Makeup Backend API',
      version: '1.0.0',
      description: 'API documentation for the makeup backend service',
    },
    servers: [{ url: `http://localhost:${env.port}` }],
    security: [{ bearerAuth: [] }],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  },
  apis: ['./src/routes/*.js'],
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);

app.use(cors({ origin: env.corsOrigin, credentials: true }));
app.use(express.json());
app.use('/admin', express.static(path.join(__dirname, '../..', 'makeup_admin')));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

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
