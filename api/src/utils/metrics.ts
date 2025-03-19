import client from 'prom-client';
import express from 'express';

const collectDefaultMetrics = client.collectDefaultMetrics;
collectDefaultMetrics({ register: client.register });

const httpRequestDuration = new client.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status_code'],
  buckets: [0.1, 0.3, 0.5, 1, 3, 5],
});

// Middleware to measure request durations
export function metricsMiddleware(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  const start = process.hrtime();
  res.on('finish', () => {
    const duration = process.hrtime(start);
    const durationInSeconds = duration[0] + duration[1] / 1e9;
    httpRequestDuration
      .labels(req.method, req.path, res.statusCode.toString())
      .observe(durationInSeconds);
  });
  next();
}

export { client };
