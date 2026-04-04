import { Notice, Prisma } from '../../generated/prisma';
import { BadRequestError, ConflictError, NotFoundError } from '../../shared/errors/app.error';
import { PaginatedFilter } from '../../shared/schemas/common.schema';
import { PaginatedResult } from '../../shared/types/api.types';
import { NoticesRepository } from './notices.repository';
import { CreateNoticeDTO, NoticeFilterDTO, UpdateNoticeDTO } from './notices.schema';

export class NoticesService {
  constructor(private repository: NoticesRepository) {}

  async findNoticeById(id: string): Promise<Notice> {
    const notice = await this.repository.findById(id);
    if (!notice) throw new NotFoundError('Aviso no encontrado', id);
    return notice;
  }

  async findAll(
    filters: Partial<NoticeFilterDTO>,
    pagination: Partial<PaginatedFilter>,
  ): Promise<PaginatedResult<Notice>> {
    return this.repository.findWithFilters(filters as Prisma.NoticeWhereInput, pagination);
  }

  async createNotice(data: CreateNoticeDTO): Promise<Notice> {
    const existing = await this.repository.findWithFilters({ title: data.title });
    if (existing.data.length > 0) throw new ConflictError('Notice', 'title');
    return this.repository.create(data as Prisma.NoticeCreateInput);
  }

  async updateNotice(id: string, data: UpdateNoticeDTO): Promise<Notice> {
    await this.findNoticeById(id);
    const updatedNotice = await this.repository.update(id, data as Prisma.NoticeUpdateInput);
    if (!updatedNotice) throw new BadRequestError('Failed to update notice');
    return updatedNotice;
  }

  async deleteNotice(id: string): Promise<void> {
    await this.findNoticeById(id);
    await this.repository.delete(id);
  }
}
