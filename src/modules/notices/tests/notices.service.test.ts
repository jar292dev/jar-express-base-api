import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NoticesService } from '../notices.service';
import { NotFoundError, ConflictError } from '../../../shared/errors/app.error';

// Mock del repositorio
const mockRepository = {
  findById: vi.fn(),
  findWithFilters: vi.fn(),
  create: vi.fn(),
  update: vi.fn(),
  delete: vi.fn(),
};

const service = new NoticesService(mockRepository as any);

const mockNotice = {
  id: '123e4567-e89b-12d3-a456-426614174000',
  title: 'Test notice',
  body: 'Test body',
  level: 'info' as const,
  isActive: true,
  startsAt: new Date(),
  endsAt: new Date(),
  createdAt: new Date(),
  updatedAt: new Date(),
  version: 1,
};

beforeEach(() => vi.clearAllMocks());

describe('NoticesService', () => {
  describe('findNoticeById', () => {
    it('devuelve el notice si existe', async () => {
      mockRepository.findById.mockResolvedValue(mockNotice);
      const result = await service.findNoticeById(mockNotice.id);
      expect(result).toEqual(mockNotice);
    });

    it('lanza NotFoundError si no existe', async () => {
      mockRepository.findById.mockResolvedValue(null);
      await expect(service.findNoticeById('no-existe')).rejects.toThrow(NotFoundError);
    });
  });

  describe('createNotice', () => {
    it('crea el notice si el título no existe', async () => {
      mockRepository.findWithFilters.mockResolvedValue({ data: [], meta: {} });
      mockRepository.create.mockResolvedValue(mockNotice);
      const result = await service.createNotice({
        title: mockNotice.title,
        body: mockNotice.body,
        level: mockNotice.level,
        isActive: mockNotice.isActive,
        startsAt: mockNotice.startsAt,
        endsAt: mockNotice.endsAt,
      });
      expect(result).toEqual(mockNotice);
    });

    it('lanza ConflictError si el título ya existe', async () => {
      mockRepository.findWithFilters.mockResolvedValue({ data: [mockNotice], meta: {} });
      await expect(service.createNotice({ title: mockNotice.title } as any)).rejects.toThrow(
        ConflictError,
      );
    });
  });

  describe('deleteNotice', () => {
    it('elimina el notice si existe', async () => {
      mockRepository.findById.mockResolvedValue(mockNotice);
      mockRepository.delete.mockResolvedValue(true);
      await expect(service.deleteNotice(mockNotice.id)).resolves.toBeUndefined();
    });

    it('lanza NotFoundError si no existe', async () => {
      mockRepository.findById.mockResolvedValue(null);
      await expect(service.deleteNotice('no-existe')).rejects.toThrow(NotFoundError);
    });
  });
});
