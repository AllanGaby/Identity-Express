import { container } from 'tsyringe';
import IUserHashProvider from './providers/UserHashProvider/models/IUserHashProvider';
import ITokenProvider from './providers/TokenProvider/models/ITokenProvider';
import UserHashProvider from './providers/UserHashProvider/implementations/UserHashProvider';
import JWTokenProvider from './providers/TokenProvider/implementations/JWTokenProvider';
import IUsersRepository from '../repositories/models/IUsersRepository';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import IForgotPasswordSessionsRepository from '../repositories/models/IForgotPasswordSessionsRepository';
import FakeForgotPasswordSessionsRepository from '../repositories/fakes/FakeSessionsRepository';

container.registerSingleton<IUserHashProvider>(
  'UserHashProvider',
  UserHashProvider,
);
container.registerSingleton<ITokenProvider>('TokenProvider', JWTokenProvider);
container.registerSingleton<IUsersRepository>(
  'UsersRepository',
  FakeUsersRepository,
);
container.registerSingleton<IForgotPasswordSessionsRepository>(
  'ForgotPasswordSessionsRepository',
  FakeForgotPasswordSessionsRepository,
);
