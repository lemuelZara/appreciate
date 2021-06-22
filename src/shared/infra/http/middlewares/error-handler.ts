import { NextFunction, Request, Response } from 'express';

import { AppError } from '~shared/errors';
import { HttpStatus } from '~shared/infra/http/enums';

export async function errorHandler(
  err: Error,
  httpRequest: Request,
  httpResponse: Response,
  _: NextFunction
) {
  if (err instanceof AppError) {
    return httpResponse.status(err.statusCode).json({ message: err.message });
  }

  return httpResponse.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
    status: 'error',
    message: `Internal Server Error - ${err.message}`
  });
}
