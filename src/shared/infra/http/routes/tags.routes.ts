import { Router } from 'express';

import { AddTagController } from '~modules/tags/usecases/add-tag';

import { ensureAuthenticated } from '~shared/infra/http/middlewares/ensure-authenticated';

const tagsRoutes = Router();

const addTagController = new AddTagController();

tagsRoutes.post('/', ensureAuthenticated, addTagController.handle);

export { tagsRoutes };
