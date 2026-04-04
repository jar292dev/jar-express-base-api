import { NoticesRepository } from '../modules/notices/notices.repository';

export const container = {
  noticesRepository: new NoticesRepository(),
};
