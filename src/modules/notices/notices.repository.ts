import { prisma } from '../../database/prisma.client';
import { Prisma, Notice } from '../../generated/prisma';
import { BaseRepository } from '../../shared/repositories/base.repository';
import { PaginatedFilter } from '../../shared/schemas/common.schema';
import { PaginatedResult } from '../../shared/types/api.types';

export class NoticesRepository extends BaseRepository<
  Notice,
  Prisma.NoticeWhereInput,
  Prisma.NoticeCreateInput,
  Prisma.NoticeUpdateInput
> {
  protected delegate = prisma.notice;
  async findWithFilters(
    businessFilters: Prisma.NoticeWhereInput,
    {
      page = 1,
      pageSize = 20,
      orderBy = 'createdAt',
      orderDirection = 'desc',
    }: Partial<PaginatedFilter> = {},
  ): Promise<PaginatedResult<Notice>> {
    const [total, data] = await prisma.$transaction([
      prisma.notice.count({ where: businessFilters }),
      prisma.notice.findMany({
        where: businessFilters,
        orderBy: { [orderBy]: orderDirection },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
    ]);

    return {
      data,
      meta: {
        total,
        page,
        limit: pageSize,
        pages: Math.ceil(total / pageSize),
      },
    };
  }
}
