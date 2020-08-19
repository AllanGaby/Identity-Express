import { container } from 'tsyringe';
import IUserHashProvider from './models/IUserHashProvider';
import UserHashProvider from './implementations/UserHashProvider';

container.registerSingleton<IUserHashProvider>(
  'UserHashProvider',
  UserHashProvider,
);
