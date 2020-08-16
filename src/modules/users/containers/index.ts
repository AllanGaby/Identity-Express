import { container } from 'tsyringe';
import UsersRepositoryTypeORM from '@modules/users/infra/typeorm/repositories/UsersRepositoryTypeORM';
import ForgotPasswordSessionsRepositoryTypeORM from '@modules/users/infra/typeorm/repositories/ForgotPasswordSessionsRepositoryTypeORM';
import IUserHashProvider from './providers/UserHashProvider/models/IUserHashProvider';
import ITokenProvider from './providers/TokenProvider/models/ITokenProvider';
import UserHashProvider from './providers/UserHashProvider/implementations/UserHashProvider';
import JWTokenProvider from './providers/TokenProvider/implementations/JWTokenProvider';
import IUsersRepository from '../repositories/models/IUsersRepository';
import IForgotPasswordSessionsRepository from '../repositories/models/IForgotPasswordSessionsRepository';

container.registerSingleton<IUserHashProvider>(
  'UserHashProvider',
  UserHashProvider,
);
container.registerSingleton<ITokenProvider>('TokenProvider', JWTokenProvider);
container.registerSingleton<IUsersRepository>(
  'UsersRepository',
  UsersRepositoryTypeORM,
);
container.registerSingleton<IForgotPasswordSessionsRepository>(
  'ForgotPasswordSessionsRepository',
  ForgotPasswordSessionsRepositoryTypeORM,
);
