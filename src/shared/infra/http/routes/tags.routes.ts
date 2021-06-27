import { Router } from 'express';

import { AddTagController } from '~modules/tags/usecases/add-tag';
import { ListTagsController } from '~modules/tags/usecases/list-tags';

import { ensureAuthenticated } from '~shared/infra/http/middlewares/ensure-authenticated';
import { ensureAdmin } from '~shared/infra/http/middlewares/ensure-admin';

const tagsRoutes = Router();

const addTagController = new AddTagController();
const listTagsController = new ListTagsController();

tagsRoutes.post('/', ensureAuthenticated, ensureAdmin, addTagController.handle);
tagsRoutes.get('/', ensureAuthenticated, listTagsController.handle);

export { tagsRoutes };
