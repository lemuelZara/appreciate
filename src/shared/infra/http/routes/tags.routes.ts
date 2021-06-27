import { Router } from 'express';

import { AddTagController } from '~modules/tags/usecases/add-tag';

import { ensureAuthenticated } from '~shared/infra/http/middlewares/ensure-authenticated';
import { ensureAdmin } from '~shared/infra/http/middlewares/ensure-admin';

const tagsRoutes = Router();

const addTagController = new AddTagController();

tagsRoutes.post('/', ensureAuthenticated, ensureAdmin, addTagController.handle);

export { tagsRoutes };
