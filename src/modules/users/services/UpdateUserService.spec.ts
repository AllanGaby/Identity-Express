import fs from 'fs';
import AppError from '@shared/errors/AppError';
import FakeHashProvider from '@shared/containers/providers/HashProvider/fakes/FakeHashProvider';
import FakeMailProvider from '@shared/containers/providers/MailProvider/fakes/FakeMailProvider';
import FakeStorageProvider from '@shared/containers/providers/StorageProvider/fakes/FakeStorageProvider';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeUserHashProvider from '../containers/providers/UserHashProvider/fakes/FakeUserHashProvider';
import UpdateUserService from './UpdateUserService';
import User, { UserStatus } from '../entities/User';

let userHashProvider: FakeUserHashProvider;
let mailProvider: FakeMailProvider;
let hashProvider: FakeHashProvider;
let storageProvider: FakeStorageProvider;
let usersRepository: FakeUsersRepository;
let updateUser: UpdateUserService;
let createdUser: User;

describe('UpdateUser', () => {
  beforeEach(async () => {
    userHashProvider = new FakeUserHashProvider();
    mailProvider = new FakeMailProvider();
    hashProvider = new FakeHashProvider();
    storageProvider = new FakeStorageProvider();
    usersRepository = new FakeUsersRepository();
    updateUser = new UpdateUserService(
      userHashProvider,
      hashProvider,
      mailProvider,
      storageProvider,
      usersRepository,
    );
    createdUser = await usersRepository.create({
      name: 'User To Update',
      email: 'usertoupdate@identity.com',
      password: '123456',
      hash: 'Hash Valid to Update',
      status: UserStatus.Validated,
    });
  });

  it('should be able update the name of user', async () => {
    jest
      .spyOn(userHashProvider, 'compareHash')
      .mockImplementationOnce(async () => {
        return true;
      });
    const onSendMail = jest.spyOn(mailProvider, 'sendMail');
    const name = 'New User Name';
    const user = await updateUser.execute({
      id: createdUser.id,
      name,
    });
    expect(user).toHaveProperty('name');
    expect(user.name).toEqual(name);
    expect(user).toHaveProperty('email');
    expect(user.email).toEqual(createdUser.email);
    expect(user).not.toHaveProperty('password');
    expect(user).not.toHaveProperty('hash');
    expect(onSendMail).not.toHaveBeenCalled();
  });

  it('should be able update the email of user', async () => {
    jest
      .spyOn(userHashProvider, 'compareHash')
      .mockImplementationOnce(async () => {
        return true;
      });
    const onSendMail = jest.spyOn(mailProvider, 'sendMail');
    const email = 'newuseremail@identity.com';
    const user = await updateUser.execute({
      id: createdUser.id,
      email,
    });
    expect(user).toHaveProperty('name');
    expect(user.name).toEqual(createdUser.name);
    expect(user).toHaveProperty('email');
    expect(user.email).toEqual(email);
    expect(user).not.toHaveProperty('password');
    expect(user).not.toHaveProperty('hash');
    expect(onSendMail).toHaveBeenCalledTimes(1);
  });

  it('should be able update the password of user', async () => {
    jest
      .spyOn(userHashProvider, 'compareHash')
      .mockImplementationOnce(async () => {
        return true;
      });
    const onSendMail = jest.spyOn(mailProvider, 'sendMail');
    const user = await updateUser.execute({
      id: createdUser.id,
      password: '654321',
    });
    expect(user).toHaveProperty('name');
    expect(user.name).toEqual(createdUser.name);
    expect(user).toHaveProperty('email');
    expect(user.email).toEqual(createdUser.email);
    expect(user).not.toHaveProperty('password');
    expect(user).not.toHaveProperty('hash');
    expect(onSendMail).not.toHaveBeenCalled();
  });

  it('should be able update user and upload file', async () => {
    jest
      .spyOn(userHashProvider, 'compareHash')
      .mockImplementationOnce(async () => {
        return true;
      });
    const onSendMail = jest.spyOn(mailProvider, 'sendMail');
    const onFileExists = jest.spyOn(storageProvider, 'fileExists');
    const onDeleteFile = jest.spyOn(storageProvider, 'deleteFile');
    const onSaveFile = jest.spyOn(storageProvider, 'saveFile');
    jest.spyOn(fs.promises, 'unlink').mockImplementationOnce(async path => {});
    await storageProvider.saveFile({
      destinationFile: createdUser.id,
      sourceFilePath: createdUser.id,
    });
    const user = await updateUser.execute({
      id: createdUser.id,
      temporaryAvatarPath: 'New File.jpg',
    });
    expect(user).toHaveProperty('name');
    expect(user.name).toEqual(createdUser.name);
    expect(user).toHaveProperty('email');
    expect(user.email).toEqual(createdUser.email);
    expect(user).not.toHaveProperty('password');
    expect(user).not.toHaveProperty('hash');
    expect(onSendMail).not.toHaveBeenCalled();
    expect(onFileExists).toHaveBeenCalled();
    expect(onDeleteFile).toHaveBeenCalled();
    expect(onSaveFile).toHaveBeenCalled();
  });

  it('should be able update user and upload a new file', async () => {
    jest
      .spyOn(userHashProvider, 'compareHash')
      .mockImplementationOnce(async () => {
        return true;
      });
    const onSendMail = jest.spyOn(mailProvider, 'sendMail');
    const onFileExists = jest.spyOn(storageProvider, 'fileExists');
    const onDeleteFile = jest.spyOn(storageProvider, 'deleteFile');
    const onSaveFile = jest.spyOn(storageProvider, 'saveFile');
    jest.spyOn(fs.promises, 'unlink').mockImplementationOnce(async path => {});
    const user = await updateUser.execute({
      id: createdUser.id,
      temporaryAvatarPath: 'New File.jpg',
    });
    expect(user).toHaveProperty('name');
    expect(user.name).toEqual(createdUser.name);
    expect(user).toHaveProperty('email');
    expect(user.email).toEqual(createdUser.email);
    expect(user).not.toHaveProperty('password');
    expect(user).not.toHaveProperty('hash');
    expect(onSendMail).not.toHaveBeenCalled();
    expect(onFileExists).toHaveBeenCalled();
    expect(onDeleteFile).not.toHaveBeenCalled();
    expect(onSaveFile).toHaveBeenCalled();
  });

  it('should not be able update a non-exists user', async () => {
    jest
      .spyOn(userHashProvider, 'compareHash')
      .mockImplementationOnce(async () => {
        return true;
      });
    try {
      await updateUser.execute({
        id: 'Non-exists user Id',
        name: 'Non-exists User',
      });
    } catch (err) {
      expect(err).toBeInstanceOf(AppError);
      expect(err.message).toEqual('User not found');
      expect(err.statusCode).toEqual(404);
    }
  });

  it('should not be able update a user if exists other user with same name', async () => {
    jest
      .spyOn(userHashProvider, 'compareHash')
      .mockImplementationOnce(async () => {
        return true;
      });
    const otherUser = await usersRepository.create({
      name: 'User With Same Name',
      email: 'usertoupdate@identity.com',
      password: '123456',
      hash: 'Hash Valid to Update',
      status: UserStatus.Validated,
    });

    try {
      await updateUser.execute({
        id: createdUser.id,
        name: otherUser.name,
      });
    } catch (err) {
      expect(err).toBeInstanceOf(AppError);
      expect(err.message).toEqual(
        `There is a user with the name ${otherUser.name}`,
      );
    }
  });

  it('should not be able update a user if exists other user with same email', async () => {
    const otherUser = await usersRepository.create({
      name: 'User With Same Email',
      email: 'sameemail@identity.com',
      password: '123456',
      hash: 'Hash Valid to Update',
      status: UserStatus.Validated,
    });

    try {
      await updateUser.execute({
        id: createdUser.id,
        email: otherUser.email,
      });
    } catch (err) {
      expect(err).toBeInstanceOf(AppError);
      expect(err.message).toEqual(
        `There is a user with the e-mail ${otherUser.email}`,
      );
    }
  });

  it('should not be able update a user corrupted', async () => {
    jest.spyOn(hashProvider, 'compareHash').mockImplementationOnce(async () => {
      return false;
    });

    try {
      await updateUser.execute({
        id: createdUser.id,
        name: 'Invalid Hash User',
      });
    } catch (err) {
      expect(err).toBeInstanceOf(AppError);
      expect(err.message).toEqual('User is currupted');
    }
  });
});