import { Router } from 'express';
import { AddTagController } from '~modules/tags/usecases/add-tag';

const tagsRoutes = Router();

const addTagController = new AddTagController();

tagsRoutes.post('/', addTagController.handle);

export { tagsRoutes };
