import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { Express } from "express";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Video Rental API",
      version: "1.0.0",
      description: "API documentation for the Sakila-based video rental system",
    },
    servers: [{ url: "http://localhost:4000" }],
    components: {
      schemas: {
        Movie: {
          type: "object",
          required: ["title", "description", "release_year"],
          properties: {
            film_id: { type: "integer", example: 1 },
            title: { type: "string", example: "Inception" },
            description: { type: "string", example: "A mind-bending thriller" },
            release_year: { type: "integer", example: 2010 },
          },
        },
      },
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
  },
  apis: ["./src/router/*.ts"],
};


const swaggerSpec = swaggerJsdoc(options);

export function setupSwagger(app: Express) {
  app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}
