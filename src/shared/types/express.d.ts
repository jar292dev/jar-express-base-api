import 'express';

declare namespace Express {
  interface Request {
    validatedBody?: Record<string, unknown>;
    validatedQuery?: Record<string, unknown>;
    validatedParams?: Record<string, unknown>;
  }
}
