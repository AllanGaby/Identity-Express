import { container } from 'tsyringe';
import UsersRepositoryTypeORM from '@modules/users/infra/typeorm/repositories/UsersRepositoryTypeORM';
import ForgotPasswordSessionsRepositoryTypeORM from '@modules/users/infra/typeorm/repositories/ForgotPasswordSessionsRepositoryTypeORM';
import IUsersRepository from '../repositories/models/IUsersRepository';
import IForgotPasswordSessionsRepository from '../repositories/models/IForgotPasswordSessionsRepository';
import './providers/TokenProvider';
import './providers/UserHashProvider';

container.registerSingleton<IUsersRepository>(
  'UsersRepository',
  UsersRepositoryTypeORM,
);
container.registerSingleton<IForgotPasswordSessionsRepository>(
  'ForgotPasswordSessionsRepository',
  ForgotPasswordSessionsRepositoryTypeORM,
);
