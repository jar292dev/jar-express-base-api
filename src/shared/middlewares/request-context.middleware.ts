import { Request, Response, NextFunction } from 'express';

// Cuando añadas auth, aquí extraerás el userId del JWT
export function requestContextMiddleware(req: Request, _res: Response, next: NextFunction): void {
  console.log('RequestContextMiddleware: setting up request context');
  req.context = {
    actorId: null, // req.user?.id cuando haya auth
  };
  next();
}
