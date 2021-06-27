import { Router } from 'express';

import { AddComplimentController } from '~modules/compliments/usecases/add-compliment';

const complimentsRoutes = Router();

const addComplimentController = new AddComplimentController();

complimentsRoutes.post('/', addComplimentController.handle);

export { complimentsRoutes };
