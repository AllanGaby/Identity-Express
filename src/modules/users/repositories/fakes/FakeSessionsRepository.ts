import { v4 } from 'uuid';
import Session from '@modules/users/entities/ForgotPasswordSession';
import IForgotPasswordSessionsRepository from '../models/IForgotPasswordSessionsRepository';

export default class FakeForgotPasswordSessionsRepository
  implements IForgotPasswordSessionsRepository {
  private forgotPasswordSessions: Session[] = [];

  public async findById(id: string): Promise<Session | undefined> {
    return this.forgotPasswordSessions.find(session => session.id === id);
  }

  public async create(sessionToCreate: Omit<Session, 'id'>): Promise<Session> {
    const session = {
      ...sessionToCreate,
      id: v4(),
    };
    this.forgotPasswordSessions.push(session);
    return {
      ...session,
    };
  }

  public async update(sessionToUpdate: Session): Promise<Session> {
    const sessionIndex = this.forgotPasswordSessions.findIndex(
      session => session.id === sessionToUpdate.id,
    );
    if (sessionIndex > 0) {
      this.forgotPasswordSessions[sessionIndex] = sessionToUpdate;
    } else {
      this.forgotPasswordSessions.push(sessionToUpdate);
    }
    return {
      ...sessionToUpdate,
    };
  }
}
