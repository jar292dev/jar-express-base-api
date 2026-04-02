import { KyselyClient } from '../db/kysely';
import { NoticesRepository } from '../modules/notices/notices.repository';

export const container = {
  noticesRepository: new NoticesRepository(KyselyClient.getInstance()),
};
