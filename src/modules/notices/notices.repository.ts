import { prisma } from '../../database/prisma.client';
import { Prisma, Notice } from '../../generated/prisma';
import { PaginatedFilter } from '../../shared/schemas/common.schema';
import { PaginatedResult } from '../../shared/types/api.types';

export class NoticesRepository {
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

  async findById(id: string): Promise<Notice | null> {
    return prisma.notice.findUnique({ where: { id } });
  }

  async create(data: Prisma.NoticeCreateInput): Promise<Notice> {
    return prisma.notice.create({ data });
  }

  async update(id: string, data: Prisma.NoticeUpdateInput): Promise<Notice | null> {
    return prisma.notice.update({ where: { id }, data });
  }

  async delete(id: string): Promise<boolean> {
    await prisma.notice.delete({ where: { id } });
    return true;
  }
}
