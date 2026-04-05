import { AuditRepository } from '../repositories/audit.repository';
import { BaseRepository } from '../repositories/base.repository';
import { BaseEntity } from '../types/base.entity';
import { RequestContext } from '../types/request-context';
import { NotFoundError } from '../errors/app.error';
import { PaginatedFilter } from '../schemas/common.schema';
import { PaginatedResult } from '../types/api.types';

export abstract class BaseService<T extends BaseEntity, W, C extends object, U extends object> {
  protected abstract entityName: string;

  constructor(
    protected repository: BaseRepository<
      T,
      W,
      C & { createdBy?: string | null },
      U & { updatedBy?: string | null }
    >,
    protected auditRepository: AuditRepository,
  ) {}

  async findById(id: string): Promise<T> {
    const entity = await this.repository.findById(id);
    if (!entity) throw new NotFoundError(`${this.entityName} no encontrado`, id);
    return entity;
  }

  async findAll(where: W, pagination: Partial<PaginatedFilter>): Promise<PaginatedResult<T>> {
    return this.repository.findWithFilters(where, pagination);
  }

  async create(data: C, context: RequestContext): Promise<T> {
    const created = await this.repository.create({
      ...data,
      createdBy: context.actorId,
    } as C & { createdBy?: string | null });

    await this.auditRepository.log({
      entity: this.entityName,
      entityId: created.id,
      action: 'CREATE',
      actorId: context.actorId,
      after: created as object,
    });

    return created;
  }

  async update(id: string, data: U, context: RequestContext): Promise<T> {
    const before = await this.findById(id);

    const updated = await this.repository.update(id, {
      ...data,
      updatedBy: context.actorId,
    } as U & { updatedBy?: string | null });

    await this.auditRepository.log({
      entity: this.entityName,
      entityId: id,
      action: 'UPDATE',
      actorId: context.actorId,
      before: before as object,
      after: updated as object,
    });

    return updated!;
  }

  async delete(id: string, context: RequestContext): Promise<void> {
    const before = await this.findById(id);

    await this.repository.delete(id);

    await this.auditRepository.log({
      entity: this.entityName,
      entityId: id,
      action: 'DELETE',
      actorId: context.actorId,
      before: before as object,
    });
  }
}
