import ForgotPasswordSession from '../../entities/ForgotPasswordSession';

export default interface IForgotPasswordSessionsRepository {
  findById(id: string): Promise<ForgotPasswordSession | undefined>;
  create(
    sessionToCreate: Omit<ForgotPasswordSession, 'id'>,
  ): Promise<ForgotPasswordSession>;
  update(
    sessionToUpdate: ForgotPasswordSession,
  ): Promise<ForgotPasswordSession>;
}
