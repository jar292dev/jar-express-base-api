import { Request, Response, NextFunction } from 'express';
import { AppError } from '../errors/app.error';
import { HTTP_STATUS } from '../constants/http.constants';
import { ERROR_MESSAGES } from '../constants/messages.constants';
import { ApiError } from '../types/api.types';

export function errorMiddleware(
  err: Error,
  req: Request,
  res: Response<ApiError>,
  next: NextFunction,
): void {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      error: {
        code: err.code,
        message: err.message,
      },
    });
    return;
  }

  console.error('[Unhandled Error]', err);
  res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
    error: {
      code: 'INTERNAL_ERROR',
      message: ERROR_MESSAGES.INTERNAL,
    },
  });
}
