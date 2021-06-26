import { Router } from 'express';

import { usersRoutes } from './users.routes';
import { tagsRoutes } from './tags.routes';

const routes = Router();

routes.use('/users', usersRoutes);
routes.use('/tags', tagsRoutes);

export { routes };
