import { Request, Response, NextFunction } from 'express';
import { container } from 'tsyringe';

import { EnsureAdminMiddleware } from './ensure-admin.middleware';

export async function ensureAdmin(
  httpRequest: Request,
  httpResponse: Response,
  next: NextFunction
): Promise<void> {
  const ensureAdminMiddleware = container.resolve(EnsureAdminMiddleware);

  await ensureAdminMiddleware.handle(httpRequest, httpResponse, next);
}
