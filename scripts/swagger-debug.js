const path = require('path');
const swaggerJSDoc = require('swagger-jsdoc');
const env = require('../src/config/env');

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Makeup Backend API',
      version: '1.0.0',
      description: 'API documentation for the makeup backend service',
    },
    servers: [{ url: `http://localhost:${env.port}` }],
  },
  apis: ['./src/routes/*.js'],
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);
console.log(JSON.stringify({ apis: swaggerOptions.apis, paths: Object.keys(swaggerSpec.paths || {}), components: Object.keys(swaggerSpec.components || {}) }, null, 2));
