import { Router } from 'express';

import { AuthUserController } from '~modules/users/usecases/auth-user';

const authRoutes = Router();

const authUserController = new AuthUserController();

authRoutes.post('/', authUserController.handle);

export { authRoutes };
