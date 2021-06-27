import { Request, Response, NextFunction } from 'express';
import { container } from 'tsyringe';

import { EnsureAuthenticatedMiddleware } from './ensure-authenticated.middleware';

export async function ensureAuthenticated(
  httpRequest: Request,
  httpResponse: Response,
  next: NextFunction
): Promise<void> {
  const ensureAuthenticatedMiddleware = container.resolve(
    EnsureAuthenticatedMiddleware
  );

  await ensureAuthenticatedMiddleware.handle(httpRequest, httpResponse, next);
}
