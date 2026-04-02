import { Router } from 'express';
import { noticeFilterSchema, noticeIdSchema } from './notices.schema';
import { validateParams, validateQuery } from '../../shared/middlewares/validate.middleware';
import { NoticesController } from './notices.controller';
import { NoticesService } from './notices.service';
import { container } from '../../shared/container';

const service = new NoticesService(container.noticesRepository);
const controller = new NoticesController(service);

const router = Router();

router.get('/all', controller.getAllNotices);
router.get('/', validateQuery(noticeFilterSchema), controller.getAllFilteredNotices);
router.get('/:id', validateParams(noticeIdSchema), controller.getNotice);

export default router;
