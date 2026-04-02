// Respuesta de éxito
export interface ApiResponse<T> {
  data: T;
  meta?: ApiMeta;
}

// Respuesta de éxito paginada
export interface ApiMeta {
  total: number;
  page: number;
  limit: number;
  pages: number;
}

// Respuesta de error
export interface ApiError {
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
}

// Helpers para construir respuestas tipadas
export const ApiResponse = {
  success<T>(data: T, meta?: ApiMeta): ApiResponse<T> {
    return meta ? { data, meta } : { data };
  },
  paginated<T>(data: T[], total: number, page: number, limit: number): ApiResponse<T[]> {
    return {
      data,
      meta: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    };
  },
};
