import { getRepository, Repository } from 'typeorm';
import IForgotPasswordSessionsRepository from '@modules/users/repositories/models/IForgotPasswordSessionsRepository';
import ForgotPasswordSession from '@modules/users/entities/ForgotPasswordSession';
import ForgotPasswordSessionTypeORM from '../entities/ForgotPasswordSession';

export default class ForgotPasswordSessionsRepositoryTypeORM
  implements IForgotPasswordSessionsRepository {
  private typeORMRepository: Repository<ForgotPasswordSessionTypeORM>;

  constructor() {
    this.typeORMRepository = getRepository(ForgotPasswordSessionTypeORM);
  }

  public async findById(
    id: string,
  ): Promise<ForgotPasswordSession | undefined> {
    const session = await this.typeORMRepository.findOne(id);
    return session;
  }

  public async create(
    sessionToCreate: Omit<ForgotPasswordSession, 'id'>,
  ): Promise<ForgotPasswordSession> {
    const session = this.typeORMRepository.create({
      ...sessionToCreate,
    });
    await this.typeORMRepository.save(session);
    return session;
  }

  public async update(
    sessionToUpdate: ForgotPasswordSession,
  ): Promise<ForgotPasswordSession> {
    await this.typeORMRepository.save(sessionToUpdate);
    return sessionToUpdate;
  }
}
