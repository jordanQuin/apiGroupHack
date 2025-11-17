import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API Documentation",
      version: "1.0.0",
      description: "Documentation de mon API avec Swagger",
    },
    servers: [
      {
        url: "http://localhost:3000", // adapte à ton port
      },
    ],
  },
  apis: ["./api/cars/v1/*.js"], // fichiers où tu décriras les endpoints
};

const swaggerSpec = swaggerJsdoc(options);

export { swaggerUi, swaggerSpec };