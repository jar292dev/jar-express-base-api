import { z } from 'zod';

export const paginatedFilterSchema = z.object({
  // Paginación
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),

  // Ordenación — los valores concretos se sobreescriben al extender
  orderBy: z.string().default('created_at'),
  orderDirection: z.enum(['asc', 'desc']).default('desc'),
});

export type PaginatedFilter = z.infer<typeof paginatedFilterSchema>;
