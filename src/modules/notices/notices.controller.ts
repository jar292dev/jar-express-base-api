import { Request, Response, NextFunction } from 'express';
import { Notice } from '../../generated/prisma';
import { HTTP_STATUS } from '../../shared/constants/http.constants';
import { ApiResponse } from '../../shared/types/api.types';
import { CreateNoticeDTO, NoticeFilterDTO, UpdateNoticeDTO } from './notices.schema';
import { NoticesService } from './notices.service';
import { UUID } from '../../shared/schemas/common.schema';

export class NoticesController {
  constructor(private noticesService: NoticesService) {}

  findNotice = async (
    req: Request<UUID>,
    res: Response<ApiResponse<Notice>>,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const notice = await this.noticesService.findNoticeById(req.params.id);
      res.status(HTTP_STATUS.OK).json(ApiResponse.success(notice));
    } catch (err) {
      next(err);
    }
  };

  findAllNotices = async (
    req: Request,
    res: Response<ApiResponse<Notice[]>>,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const query = (req.validatedQuery ?? {}) as Partial<NoticeFilterDTO>;
      const { page, pageSize, orderBy, orderDirection, ...businessFilters } = query;
      const result = await this.noticesService.findAll(
        businessFilters as Partial<NoticeFilterDTO>,
        { page, pageSize, orderBy, orderDirection },
      );
      res.status(HTTP_STATUS.OK).json({ data: result.data, meta: result.meta });
    } catch (err) {
      next(err);
    }
  };

  createNotice = async (
    req: Request,
    res: Response<ApiResponse<Notice>>,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const dto = req.validatedBody as CreateNoticeDTO;
      const notice = await this.noticesService.createNotice(dto, req.context);
      res.status(HTTP_STATUS.CREATED).json(ApiResponse.success(notice));
    } catch (err) {
      next(err);
    }
  };

  updateNotice = async (
    req: Request<UUID>,
    res: Response<ApiResponse<Notice>>,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const dto = req.validatedBody as UpdateNoticeDTO;
      const notice = await this.noticesService.updateNotice(req.params.id, dto, req.context);
      res.status(HTTP_STATUS.OK).json(ApiResponse.success(notice));
    } catch (err) {
      next(err);
    }
  };

  deleteNotice = async (req: Request<UUID>, res: Response, next: NextFunction): Promise<void> => {
    try {
      await this.noticesService.deleteNotice(req.params.id, req.context);
      res.status(HTTP_STATUS.NO_CONTENT).send();
    } catch (err) {
      next(err);
    }
  };
}
