import AppError from '@shared/errors/AppError';
import FakeHashProvider from '@shared/containers/providers/HashProvider/fakes/FakeHashProvider';
import FakeMailProvider from '@shared/containers/providers/MailProvider/fakes/FakeMailProvider';
import FakeStorageProvider from '@shared/containers/providers/StorageProvider/fakes/FakeStorageProvider';
import path from 'path';
import uploadConfig from '@config/upload';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import UserHashProvider from '../containers/providers/UserHashProvider/implementations/UserHashProvider';
import CreateUserService from './CreateUserService';
import { UserStatus } from '../entities/User';

let userHashProvider: UserHashProvider;
let mailProvider: FakeMailProvider;
let hashProvider: FakeHashProvider;
let storageProvider: FakeStorageProvider;
let usersRepository: FakeUsersRepository;
let createUser: CreateUserService;

describe('CreateUser', () => {
  beforeEach(() => {
    hashProvider = new FakeHashProvider();
    userHashProvider = new UserHashProvider(hashProvider);
    mailProvider = new FakeMailProvider();
    storageProvider = new FakeStorageProvider();
    usersRepository = new FakeUsersRepository();
    createUser = new CreateUserService(
      userHashProvider,
      hashProvider,
      mailProvider,
      storageProvider,
      usersRepository,
    );
  });

  it('should be able create a new user', async () => {
    const onSendMail = jest.spyOn(mailProvider, 'sendMail');
    const name = 'New User Name';
    const email = 'newuser@identity.com';
    const user = await createUser.execute({
      name,
      email,
      password: '123456',
    });
    expect(user).toHaveProperty('name');
    expect(user.name).toEqual(name);
    expect(user).toHaveProperty('email');
    expect(user.email).toEqual(email);
    expect(user).toHaveProperty('status');
    expect(user.status).toEqual(UserStatus.Created);
    expect(user).not.toHaveProperty('password');
    expect(user).not.toHaveProperty('hash');
    expect(onSendMail).toHaveBeenCalledTimes(1);
  });

  it('should be able create a new user and upload file', async () => {
    const onSendMail = jest.spyOn(mailProvider, 'sendMail');
    const onSaveFile = jest.spyOn(storageProvider, 'saveFile');
    const name = 'New User Name';
    const email = 'newuser@identity.com';
    const avatarFile = 'newuser.jpg';
    const user = await createUser.execute({
      name,
      email,
      password: '123456',
      temporaryAvatarPath: avatarFile,
    });
    const sourceFilePath = path.resolve(uploadConfig.temporaryDir, avatarFile);

    expect(user).toHaveProperty('name');
    expect(user.name).toEqual(name);
    expect(user).toHaveProperty('email');
    expect(user.email).toEqual(email);
    expect(user).toHaveProperty('status');
    expect(user.status).toEqual(UserStatus.Created);
    expect(user).not.toHaveProperty('password');
    expect(user).not.toHaveProperty('hash');
    expect(onSendMail).toHaveBeenCalledTimes(1);
    expect(onSaveFile).toHaveBeenCalledWith({
      sourceFilePath,
      destinationFile: `${user.id}.jpg`,
    });
  });

  it('should not be able create a user if exists other user with same name', async () => {
    const name = 'New User Name';
    const email = 'newuser@identity.com';
    await usersRepository.create({
      name,
      email,
      hash: 'hash',
      password: '123456',
      status: UserStatus.Created,
    });
    try {
      await createUser.execute({
        name,
        email: 'otheremail@identity.com',
        password: '123456',
      });
    } catch (err) {
      expect(err).toBeInstanceOf(AppError);
      expect(err).toHaveProperty('message');
      expect(err).toHaveProperty('statusCode');
    }
  });

  it('should not be able create a user if exists other user with same email', async () => {
    const name = 'New User Name';
    const email = 'newuser@identity.com';
    await usersRepository.create({
      name,
      email,
      hash: 'hash',
      password: '123456',
      status: UserStatus.Created,
    });
    try {
      await createUser.execute({
        name: 'Other Name',
        email,
        password: '123456',
      });
    } catch (err) {
      expect(err).toBeInstanceOf(AppError);
      expect(err).toHaveProperty('message');
      expect(err).toHaveProperty('statusCode');
    }
  });
});
