import { Generated, Selectable } from 'kysely';

// Campos que tendrán todas las tablas
export interface BaseTable {
  id: Generated<string>;
  created_at: Generated<Date>;
  updated_at: Generated<Date>;
  version: Generated<number>;
}

// Tipo de entidad base que deriva de cualquier tabla que extienda BaseTable
export type BaseEntity = Selectable<BaseTable>;
