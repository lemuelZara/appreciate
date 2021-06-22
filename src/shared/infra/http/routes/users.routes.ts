import { Router } from 'express';

import { AddUserController } from '~modules/users/usecases/add-user';

const usersRoutes = Router();

const addUserController = new AddUserController();

usersRoutes.post('/', addUserController.handle);

export { usersRoutes };
