import { AuditRepository } from './shared/repositories/audit.repository';
import { NoticesRepository } from './modules/notices/notices.repository';
import { NoticesService } from './modules/notices/notices.service';

const auditRepository = new AuditRepository();

export const container = {
  auditRepository,
  noticesRepository: new NoticesRepository(),
  noticesService: new NoticesService(new NoticesRepository(), auditRepository),
};
