import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import app from '../../../app';
import { prisma } from '../../../database/prisma.client';

let createdId: string;

beforeAll(async () => {
  await prisma.$connect();
});

afterAll(async () => {
  if (createdId) await prisma.notice.delete({ where: { id: createdId } }).catch(() => {});
  await prisma.$disconnect();
});

describe('Notices E2E', () => {
  it('POST /api/v1/notices — crea un notice', async () => {
    const res = await request(app)
      .post('/api/v1/notices')
      .send({
        title: `E2E Test ${Date.now()}`,
        body: 'E2E body',
        level: 'info',
        isActive: true,
        startsAt: new Date().toISOString(),
        endsAt: new Date(Date.now() + 86400000).toISOString(),
      });

    expect(res.status).toBe(201);
    expect(res.body.data.id).toBeDefined();
    createdId = res.body.data.id;
  });

  it('GET /api/v1/notices — lista notices', async () => {
    const res = await request(app).get('/api/v1/notices');
    expect(res.status).toBe(200);
    expect(res.body.data).toBeInstanceOf(Array);
    expect(res.body.meta).toBeDefined();
  });

  it('GET /api/v1/notices/:id — obtiene un notice', async () => {
    const res = await request(app).get(`/api/v1/notices/${createdId}`);
    expect(res.status).toBe(200);
    expect(res.body.data.id).toBe(createdId);
  });

  it('PUT /api/v1/notices/:id — actualiza un notice', async () => {
    const res = await request(app)
      .put(`/api/v1/notices/${createdId}`)
      .send({ title: 'E2E Actualizado' });
    expect(res.status).toBe(200);
    expect(res.body.data.title).toBe('E2E Actualizado');
  });

  it('GET /api/v1/notices/:id — 404 si no existe', async () => {
    const res = await request(app).get('/api/v1/notices/018fd0a1-1234-7000-8000-000000000000');
    expect(res.status).toBe(404);
  });

  it('DELETE /api/v1/notices/:id — elimina un notice', async () => {
    const res = await request(app).delete(`/api/v1/notices/${createdId}`);
    expect(res.status).toBe(204);
    createdId = '';
  });
});
