import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { NoticesRepository } from '../notices.repository';
import { prisma } from '../../../database/prisma.client';

const repository = new NoticesRepository();

const testNotice = {
  title: `Test ${Date.now()}`,
  body: 'Integration test body',
  level: 'info' as const,
  isActive: true,
  startsAt: new Date(),
  endsAt: new Date(Date.now() + 86400000),
};

let createdId: string;

beforeAll(async () => {
  await prisma.$connect();
});

afterAll(async () => {
  if (createdId) await prisma.notice.delete({ where: { id: createdId } });
});

describe('NoticesRepository', () => {
  it('crea un notice', async () => {
    const notice = await repository.create(testNotice as any);
    expect(notice.id).toBeDefined();
    expect(notice.title).toBe(testNotice.title);
    createdId = notice.id;
  });

  it('encuentra el notice por id', async () => {
    const notice = await repository.findById(createdId);
    expect(notice).not.toBeNull();
    expect(notice?.id).toBe(createdId);
  });

  it('lista notices con paginación', async () => {
    const result = await repository.findWithFilters({}, { page: 1, pageSize: 10 });
    expect(result.data).toBeInstanceOf(Array);
    expect(result.meta.total).toBeGreaterThan(0);
  });

  it('actualiza un notice', async () => {
    const updated = await repository.update(createdId, { title: 'Título actualizado' });
    expect(updated?.title).toBe('Título actualizado');
  });

  it('elimina un notice', async () => {
    await repository.delete(createdId);
    const found = await repository.findById(createdId);
    expect(found).toBeNull();
    createdId = ''; // evita doble delete en afterAll
  });
});
