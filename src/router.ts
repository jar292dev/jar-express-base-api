import { Router } from 'express';
import noticesRouter from './modules/notices/notices.routes';

export const v1Router = Router();

v1Router.use('/notices', noticesRouter);
