import express from 'express';
import expressWinston from 'express-winston';
import logger from '../utils/logger';

// Middleware de journalisation des requêtes
export function setupRequestLogging(app: express.Express) {
  app.use((req, res, next) => {
    console.log(`[LOG] ${req.method} ${req.path}`);
    next();
  });

  app.use(
    expressWinston.logger({
      winstonInstance: logger,
      statusLevels: true,
    })
  );
}

// Middleware de journalisation des erreurs
export function setupErrorLogging(app: express.Express) {
  app.use(
    expressWinston.errorLogger({
      winstonInstance: logger,
    })
  );
}
