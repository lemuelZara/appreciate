import express from 'express';

import { errorHandler } from './middlewares';

const app = express();

app.use(express.json());
app.use(errorHandler);

export { app };
