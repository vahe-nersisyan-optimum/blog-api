import { AppError } from '../errors.js';

export function notFound(req, res, next) {
  throw new AppError(404, `Route not found: ${req.method} ${req.originalUrl}`);
}