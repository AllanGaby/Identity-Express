import AppError from '@shared/errors/AppError';
import FakeHashProvider from '@shared/containers/providers/HashProvider/fakes/FakeHashProvider';
import FakeCacheProvider from '@shared/containers/providers/CacheProvider/fakes/FakeCacheProvider';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeSessionsRepository from '../repositories/fakes/FakeSessionsRepository';
import UserHashProvider from '../containers/providers/UserHashProvider/implementations/UserHashProvider';
import ChangePasswordService from './ChangePasswordService';
import User, { UserStatus } from '../entities/User';
import Session from '../entities/ForgotPasswordSession';

let userHashProvider: UserHashProvider;
let hashProvider: FakeHashProvider;
let cacheProvider: FakeCacheProvider;
let usersRepository: FakeUsersRepository;
let sessionsRepository: FakeSessionsRepository;
let changePassword: ChangePasswordService;
let user: User;
let session: Session;
let validationDate: Date;

describe('ChangePassword', () => {
  beforeEach(async () => {
    hashProvider = new FakeHashProvider();
    userHashProvider = new UserHashProvider(hashProvider);
    cacheProvider = new FakeCacheProvider();
    usersRepository = new FakeUsersRepository();
    sessionsRepository = new FakeSessionsRepository();
    changePassword = new ChangePasswordService(
      userHashProvider,
      hashProvider,
      cacheProvider,
      usersRepository,
      sessionsRepository,
    );
    user = await usersRepository.create({
      name: 'User to Change Password',
      email: 'changepassword@identity.com',
      password: '123456',
      hash: 'Valid User Hash',
      status: UserStatus.Validated,
    });
    validationDate = new Date();
    validationDate.setHours(validationDate.getHours() + 2);

    session = await sessionsRepository.create({
      userId: user.id,
      validationDate,
    });
  });

  it('should be able change password to user', async () => {
    jest
      .spyOn(userHashProvider, 'compareHash')
      .mockImplementationOnce(async () => {
        return true;
      });
    await changePassword.execute({
      token: session.id,
      password: 'New Password',
    });
  });

  it('should not be able change password to non-exists session', async () => {
    try {
      await changePassword.execute({
        token: 'Non-exists Session',
        password: 'New Password',
      });
    } catch (err) {
      expect(err).toBeInstanceOf(AppError);
      expect(err.message).toEqual('Session not found');
      expect(err.statusCode).toEqual(404);
    }
  });

  it('should not be able change password to session expired', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      const now = new Date();
      now.setHours(now.getHours() + 10);
      return now.getTime();
    });
    try {
      await changePassword.execute({
        token: session.id,
        password: 'New Password',
      });
    } catch (err) {
      expect(err).toBeInstanceOf(AppError);
      expect(err.message).toEqual('Session is expired');
    }
  });

  it('should not be able change password to non-exists user', async () => {
    const sessionNonExistsUser = await sessionsRepository.create({
      userId: 'non-exists user',
      validationDate,
    });
    try {
      await changePassword.execute({
        token: sessionNonExistsUser.id,
        password: 'New Password',
      });
    } catch (err) {
      expect(err).toBeInstanceOf(AppError);
      expect(err.message).toEqual('Users not found');
      expect(err.statusCode).toEqual(404);
    }
  });

  it('should be able change password to user corrupted', async () => {
    jest
      .spyOn(userHashProvider, 'compareHash')
      .mockImplementationOnce(async () => {
        return false;
      });
    try {
      await changePassword.execute({
        token: session.id,
        password: 'New Password',
      });
    } catch (err) {
      expect(err).toBeInstanceOf(AppError);
      expect(err.message).toEqual('User is currupted');
    }
  });

  it('should be able change password to user with status invalid', async () => {
    jest
      .spyOn(userHashProvider, 'compareHash')
      .mockImplementationOnce(async () => {
        return true;
      });
    user.status = UserStatus.Created;
    user = await usersRepository.update(user);
    try {
      await changePassword.execute({
        token: session.id,
        password: 'New Password',
      });
    } catch (err) {
      expect(err).toBeInstanceOf(AppError);
      expect(err.message).toEqual('User status is invalid');
    }
  });
});
