import { Router } from 'express';

import { AddUserController } from '~modules/users/usecases/add-user';
import { ListUsersController } from '~modules/users/usecases/list-users';

import { ensureAuthenticated } from '~shared/infra/http/middlewares/ensure-authenticated';

const usersRoutes = Router();

const addUserController = new AddUserController();
const listUsersController = new ListUsersController();

usersRoutes.post('/', addUserController.handle);
usersRoutes.get('/', ensureAuthenticated, listUsersController.handle);

export { usersRoutes };
