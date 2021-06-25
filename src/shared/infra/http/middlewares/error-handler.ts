import { NextFunction, Request, Response } from 'express';

import { HttpException } from '~shared/errors';
import { HttpStatus } from '~shared/infra/http/enums';

export async function errorHandler(
  err: Error,
  httpRequest: Request,
  httpResponse: Response,
  _: NextFunction
) {
  if (err instanceof HttpException) {
    return httpResponse.status(err.statusCode).json({
      content: err.response
    });
  }

  console.error('💥 Internal Server Error', err.message);

  return httpResponse.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
    status: 'error',
    message: 'Internal Server Error'
  });
}
