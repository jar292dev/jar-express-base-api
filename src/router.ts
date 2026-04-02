import { Router } from 'express';
import noticesRouter from './modules/notices/notices.routes';

export const router = Router();

router.use('/v1/notices', noticesRouter);
