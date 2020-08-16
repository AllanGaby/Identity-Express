import { container } from 'tsyringe';
import IHashProvider from './providers/HashProvider/models/IHashProvider';
import BCryptHashProvider from './providers/HashProvider/implementations/BCryptHashProvider';
import IStorageProvider from './providers/StorageProvider/models/IStorageProvider';
import FakeStorageProvider from './providers/StorageProvider/fakes/FakeStorageProvider';
import '@modules/users/containers';
import './providers/MailProvider';

container.registerSingleton<IHashProvider>('HashProvider', BCryptHashProvider);
container.registerSingleton<IStorageProvider>(
  'StorageProvider',
  FakeStorageProvider,
);
