import { container } from 'tsyringe';
import IHashProvider from './providers/HashProvider/models/IHashProvider';
import BCryptHashProvider from './providers/HashProvider/implementations/BCryptHashProvider';
import IStorageProvider from './providers/StorageProvider/models/IStorageProvider';
import DiskStorageProvider from './providers/StorageProvider/implementations/DiskStorageProvider';
import '@modules/users/containers';
import './providers/MailProvider';

container.registerSingleton<IHashProvider>('HashProvider', BCryptHashProvider);
container.registerSingleton<IStorageProvider>(
  'StorageProvider',
  DiskStorageProvider,
);
