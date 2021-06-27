import { Router } from 'express';

import { usersRoutes } from './users.routes';
import { tagsRoutes } from './tags.routes';
import { authRoutes } from './auth.routes';

const routes = Router();

routes.use('/users', usersRoutes);
routes.use('/tags', tagsRoutes);
routes.use('/sessions', authRoutes);

export { routes };
