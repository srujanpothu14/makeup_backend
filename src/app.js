const express = require('express');
const path = require('path');
const fs = require('fs');
const swaggerUi = require('swagger-ui-express');
const swaggerJSDoc = require('swagger-jsdoc');
const env = require('./config/env');
const { createApiRouter } = require('./routes/apiRouter');
const { createCorsMiddleware } = require('./middleware/corsMiddleware');
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

const adminStaticPath = path.join(__dirname, '../..', 'makeup_admin/dist/admin/browser');
const adminApiPattern = /^\/admin\/(users|services|offers|settings|bookings|gallery)(\/|$)/;
const adminStaticHandler = express.static(adminStaticPath);

function serveAdminUi(req, res, next) {
  if (req.method !== 'GET') {
    next();
    return;
  }

  if (req.path === '/admin') {
    res.redirect(301, '/admin/');
    return;
  }

  if (!req.path.startsWith('/admin/')) {
    next();
    return;
  }

  if (adminApiPattern.test(req.path)) {
    next();
    return;
  }

  if (!fs.existsSync(path.join(adminStaticPath, 'index.html'))) {
    next(new AppError(503, 'Admin dashboard is not built. Run npm run build in makeup_admin.'));
    return;
  }

  const originalUrl = req.url;
  req.url = req.url.replace(/^\/admin(?=\/|$)/, '') || '/';

  adminStaticHandler(req, res, (error) => {
    req.url = originalUrl;

    if (error) {
      next(error);
      return;
    }

    if (res.headersSent) {
      return;
    }

    res.sendFile(path.join(adminStaticPath, 'index.html'), (fileError) => {
      if (fileError) next(fileError);
    });
  });
}

app.use(createCorsMiddleware());
app.use(express.json());
app.use(serveAdminUi);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use('/', createApiRouter());
app.use('/api', createApiRouter());

app.use((req, _res, next) => {
  next(new AppError(404, `Route not found: ${req.method} ${req.path}`));
});

app.use((error, _req, res, _next) => {
  if (error && error.name === 'MulterError') {
    const message =
      error.code === 'LIMIT_FILE_SIZE'
        ? 'File is too large'
        : error.message || 'Upload failed';
    res.status(400).json({ message });
    return;
  }

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
