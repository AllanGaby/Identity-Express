import { container } from 'tsyringe';
import IUserHashProvider from './providers/UserHashProvider/models/IUserHashProvider';
import FakeUserHashProvider from './providers/UserHashProvider/fakes/FakeUserHashProvider';
import ITokenProvider from './providers/TokenProvider/models/ITokenProvider';
import FakeTokenProvider from './providers/TokenProvider/fakes/FakeTokenProvider';
import IUsersRepository from '../repositories/models/IUsersRepository';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import IForgotPasswordSessionsRepository from '../repositories/models/IForgotPasswordSessionsRepository';
import FakeForgotPasswordSessionsRepository from '../repositories/fakes/FakeSessionsRepository';

container.registerSingleton<IUserHashProvider>(
  'UserHashProvider',
  FakeUserHashProvider,
);
container.registerSingleton<ITokenProvider>('TokenProvider', FakeTokenProvider);
container.registerSingleton<IUsersRepository>(
  'UsersRepository',
  FakeUsersRepository,
);
container.registerSingleton<IForgotPasswordSessionsRepository>(
  'ForgotPasswordSessionsRepository',
  FakeForgotPasswordSessionsRepository,
);