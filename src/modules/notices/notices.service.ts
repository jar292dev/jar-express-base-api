import { ConflictError, NotFoundError } from '../../shared/errors/app.error';
import { NoticesRepository } from './notices.repository';
import { CreateNoticeDTO, NoticeFilterDTO } from './notices.schema';
import { Notice } from './notices.table';

export class NoticesService {
  constructor(private noticesRepository: NoticesRepository) {}

  // Aquí puedes implementar la lógica de negocio para manejar los avisos
  // Por ejemplo, métodos para crear, obtener, actualizar y eliminar avisos

  async getNoticeById(id: string): Promise<Notice> {
    const notice = await this.noticesRepository.findById(id);
    if (!notice) throw new NotFoundError('Aviso no encontrado', id);
    return notice;
  }

  async getNoticesWithFilters(filters: NoticeFilterDTO): Promise<Notice[]> {
    return this.noticesRepository.findWithFilters(filters);
  }

  async getAllNotices(): Promise<Notice[]> {
    return this.noticesRepository.findAll();
  }

  async createNotice(data: CreateNoticeDTO): Promise<Notice> {
    const existing = await this.noticesRepository.findWithFilters({ title: data.title });
    if (existing) throw new ConflictError('Notice', 'title');
    return this.noticesRepository.create(data as Notice);
  }
}
