import { Request, Response, NextFunction } from 'express';
import { HTTP_STATUS } from '../../shared/constants/http.constants';
import { ApiResponse } from '../../shared/types/api.types';
import { NoticeFilterDTO, NoticeIdDTO } from './notices.schema';
import { Notice } from './notices.table';

import { NoticesService } from './notices.service';

export class NoticesController {
  constructor(private noticesService: NoticesService) {}

  getNotice = async (
    req: Request<NoticeIdDTO>,
    res: Response<ApiResponse<Notice>>,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const notice = await this.noticesService.getNoticeById(req.params.id);
      // if (!notice) {
      //   return res.status(HTTP_STATUS.NOT_FOUND).json({ data: null, meta: { message: 'Aviso no encontrado' } });
      // }
      res.status(HTTP_STATUS.OK).json(ApiResponse.success(notice));
    } catch (err) {
      next(err);
    }
  };

  getAllFilteredNotices = async (
    req: Request,
    res: Response<ApiResponse<Notice[]>>,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const filters = req.query as unknown as NoticeFilterDTO; // ← cast explícito
      const notices = await this.noticesService.getNoticesWithFilters(filters);
      res.status(HTTP_STATUS.OK).json(ApiResponse.success(notices));
    } catch (err) {
      next(err);
    }
  };

  getAllNotices = async (
    _req: Request,
    res: Response<ApiResponse<Notice[]>>,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const notices = await this.noticesService.getAllNotices();
      res.status(HTTP_STATUS.OK).json(ApiResponse.success(notices));
    } catch (err) {
      next(err);
    }
  };
}
