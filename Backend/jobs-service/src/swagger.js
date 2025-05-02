const swaggerJSDoc = require("swagger-jsdoc");

const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "Jobs API",
    version: "1.0.0",
    description: "API documentation for the Jobs service",
  },
};

const options = {
  swaggerDefinition,
  apis: ["src/routes/*.js"],
};

const swaggerSpec = swaggerJSDoc(options);

const fs = require('fs');
fs.writeFileSync('./jobs-swagger.json', JSON.stringify(swaggerSpec, null, 2));

module.exports = swaggerSpec;
