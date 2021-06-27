import { Router } from 'express';

import { usersRoutes } from './users.routes';
import { tagsRoutes } from './tags.routes';
import { authRoutes } from './auth.routes';
import { complimentsRoutes } from './compliments.routes';

const routes = Router();

routes.use('/users', usersRoutes);
routes.use('/tags', tagsRoutes);
routes.use('/sessions', authRoutes);
routes.use('/compliments', complimentsRoutes);

export { routes };
