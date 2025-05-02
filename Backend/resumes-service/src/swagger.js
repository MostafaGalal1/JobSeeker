const swaggerJSDoc = require("swagger-jsdoc");

const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "Resumes API",
    version: "1.0.0",
    description: "API documentation for the Resumes service",
  },
};

const options = {
  swaggerDefinition,
  apis: ["src/routes/*.js"],
};

const swaggerSpec = swaggerJSDoc(options);

const fs = require('fs');
fs.writeFileSync('./resumes-swagger.json', JSON.stringify(swaggerSpec, null, 2));

module.exports = swaggerSpec;
