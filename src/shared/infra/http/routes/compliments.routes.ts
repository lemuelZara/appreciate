import { Router } from 'express';

import { AddComplimentController } from '~modules/compliments/usecases/add-compliment';

import { ensureAuthenticated } from '~shared/infra/http/middlewares/ensure-authenticated';

const complimentsRoutes = Router();

const addComplimentController = new AddComplimentController();

complimentsRoutes.post(
  '/',
  ensureAuthenticated,
  addComplimentController.handle
);

export { complimentsRoutes };
