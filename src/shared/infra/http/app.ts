import 'reflect-metadata';
import 'express-async-errors';

import express from 'express';

import '~shared/container';

import { errorHandler } from './middlewares';
import { routes } from './routes';

const app = express();

app.use(express.json());
app.use(routes);
app.use(errorHandler);

export { app };
