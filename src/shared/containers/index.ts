import { container } from 'tsyringe';
import IHashProvider from './providers/HashProvider/models/IHashProvider';
import FakeHashProvider from './providers/HashProvider/fakes/FakeHashProvider';
import IMailProvider from './providers/MailProvider/models/IMailProvider';
import FakeMailProvider from './providers/MailProvider/fakes/FakeMailProvider';
import IMailTemplateProvider from './providers/MailProvider/MailTemplateProvider/models/IMailTemplateProvider';
import FakeMailTemplateProvider from './providers/MailProvider/MailTemplateProvider/fakes/FakeMailTemplateProvider';
import IStorageProvider from './providers/StorageProvider/models/IStorageProvider';
import FakeStorageProvider from './providers/StorageProvider/fakes/FakeStorageProvider';

container.registerSingleton<IHashProvider>('HashProvider', FakeHashProvider);
container.registerSingleton<IMailProvider>('MailProvider', FakeMailProvider);
container.registerSingleton<IMailTemplateProvider>(
  'MailTemplateProvider',
  FakeMailTemplateProvider,
);
container.registerSingleton<IStorageProvider>(
  'StorageProvider',
  FakeStorageProvider,
);
