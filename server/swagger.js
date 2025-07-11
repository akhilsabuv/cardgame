const swaggerJSDoc = require('swagger-jsdoc');

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Card Game API',
    version: '1.0.0',
    description: 'API documentation for the Card Bidding Game',
  },
  servers: [
    { url: 'http://localhost:4000', description: 'Local server' }
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT'
      }
    }
  },
  security: [{ bearerAuth: [] }],
};

const options = {
  swaggerDefinition,
  apis: [
    './routes/*.js',
  ]
};

module.exports = swaggerJSDoc(options);
