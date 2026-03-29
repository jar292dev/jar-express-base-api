import { z } from 'zod';
import dotenv from 'dotenv';

dotenv.config();

const envSchema = z.object({
  // ─── Servidor ───────────────────────────────────────────
  HOST: z.string().default('localhost'),
  PORT: z.coerce.number().default(3000),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),

  // ─── Base de datos ─────────────────────────────────────
  DB_HOST: z.string().default('localhost'),
  DB_PORT: z.coerce.number().default(5432),
  DB_USER: z.string().default('postgres'),
  DB_PASSWORD: z.string().default('password'),
  DB_NAME: z.string().default('quevemosestefinde'),
  DB_POOL_SIZE: z.coerce.number().default(10),
});

// Validación al arrancar — falla rápido si falta algo crítico
const result = envSchema.safeParse(process.env);

if (!result.success) {
  console.error('❌ Variables de entorno inválidas:\n');
  result.error.issues.forEach((issue) => {
    console.error(`  · ${issue.path.join('.')}: ${issue.message}`);
  });
  process.exit(1);
}

export const env = result.data;
export type Env = typeof env;
