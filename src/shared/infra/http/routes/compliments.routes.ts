import { Router } from 'express';

import { AddComplimentController } from '~modules/compliments/usecases/add-compliment';
import { ListUserReceiveComplimentsController } from '~modules/compliments/usecases/list-user-receive-compliments';

import { ensureAuthenticated } from '~shared/infra/http/middlewares/ensure-authenticated';

const complimentsRoutes = Router();

const addComplimentController = new AddComplimentController();
const listUserReceiveComplimentsController =
  new ListUserReceiveComplimentsController();

complimentsRoutes.post(
  '/',
  ensureAuthenticated,
  addComplimentController.handle
);
complimentsRoutes.get(
  '/users/receive',
  ensureAuthenticated,
  listUserReceiveComplimentsController.handle
);

export { complimentsRoutes };
