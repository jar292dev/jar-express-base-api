import { z } from 'zod';

export const uuidSchema = z.object({
  id: z.string().uuid(),
});

export const paginatedFilterSchema = z.object({
  // Paginación
  page: z.coerce.number().int().min(1).optional().default(1),
  pageSize: z.coerce.number().int().min(1).max(100).optional().default(20),

  // Ordenación — los valores concretos se sobreescriben al extender
  orderBy: z.string().optional().default('createdAt'),
  orderDirection: z.enum(['asc', 'desc']).optional().default('desc'),
});

export type UUID = z.infer<typeof uuidSchema>;
export type PaginatedFilter = z.infer<typeof paginatedFilterSchema>;
