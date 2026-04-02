import { Kysely } from 'kysely';
import { Database } from '../../db/database.types';
import { BaseRepository } from '../../db/base.repository';

export class NoticesRepository extends BaseRepository<'notices', Database['notices']> {
  constructor(public readonly db: Kysely<Database>) {
    super(db, 'notices');
  }

  // Aquí puedes agregar métodos específicos para manejar los avisos si es necesario
  // Por ejemplo, métodos para buscar avisos por título, fecha, etc.
}
