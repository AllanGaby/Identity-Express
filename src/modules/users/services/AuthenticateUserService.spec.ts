import AppError from '@shared/errors/AppError';
import FakeHashProvider from '@shared/containers/providers/HashProvider/fakes/FakeHashProvider';
import { UserStatus } from '../entities/User';
import AuthenticateUserService from './AuthenticateUserService';
import FakeTokenProvider from '../containers/providers/TokenProvider/fakes/FakeTokenProvider';
import UserHashProvider from '../containers/providers/UserHashProvider/implementations/UserHashProvider';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';

let userHashProvider: UserHashProvider;
let tokenProvider: FakeTokenProvider;
let hashProvider: FakeHashProvider;
let usersRepository: FakeUsersRepository;
let authenticateUser: AuthenticateUserService;
describe('AuthenticateUser', () => {
  beforeEach(() => {
    hashProvider = new FakeHashProvider();
    userHashProvider = new UserHashProvider(hashProvider);
    tokenProvider = new FakeTokenProvider();
    usersRepository = new FakeUsersRepository();
    authenticateUser = new AuthenticateUserService(
      userHashProvider,
      tokenProvider,
      hashProvider,
      usersRepository,
    );
  });

  it('should be able authenticate user', async () => {
    jest
      .spyOn(userHashProvider, 'compareHash')
      .mockImplementationOnce(async () => {
        return true;
      });
    jest.spyOn(hashProvider, 'compareHash').mockImplementationOnce(async () => {
      return true;
    });

    const email = 'johndoe@identity.com';
    const password = '123456';
    await usersRepository.create({
      status: UserStatus.Validated,
      name: 'John Doe',
      email,
      password,
      hash: 'Valid User Hash',
    });

    const authentication = await authenticateUser.execute({
      email,
      password,
    });
    expect(authentication).toHaveProperty('token');
    expect(authentication).toHaveProperty('user');
    expect(authentication.user.status).toEqual(UserStatus.Validated);
  });

  it('should not be able authenticate a non-exists user e-mail', async () => {
    try {
      await authenticateUser.execute({
        email: 'invalid e-mail',
        password: 'invalid e-mail',
      });
    } catch (err) {
      expect(err).toBeInstanceOf(AppError);
      expect(err.message).toEqual('Credentials is incorrect');
    }
  });

  it('should not be able authenticate with wrong password', async () => {
    jest
      .spyOn(userHashProvider, 'compareHash')
      .mockImplementationOnce(async () => {
        return true;
      });
    jest.spyOn(hashProvider, 'compareHash').mockImplementationOnce(async () => {
      return false;
    });

    const email = 'johndoe@identity.com';
    const password = '123456';
    await usersRepository.create({
      status: UserStatus.Validated,
      name: 'John Doe',
      email,
      password,
      hash: 'Valid User Hash',
    });

    try {
      await authenticateUser.execute({
        email,
        password: 'invalid e-mail',
      });
    } catch (err) {
      expect(err).toBeInstanceOf(AppError);
      expect(err.message).toEqual('Credentials is incorrect');
    }
  });

  it('should not be able authenticate a user corrupted', async () => {
    jest
      .spyOn(userHashProvider, 'compareHash')
      .mockImplementationOnce(async () => {
        return false;
      });
    jest.spyOn(hashProvider, 'compareHash').mockImplementationOnce(async () => {
      return true;
    });

    const email = 'johndoe@identity.com';
    const password = '123456';
    await usersRepository.create({
      status: UserStatus.Validated,
      name: 'John Doe',
      email,
      password,
      hash: 'Valid User Hash',
    });

    try {
      await authenticateUser.execute({
        email,
        password,
      });
    } catch (err) {
      expect(err).toBeInstanceOf(AppError);
      expect(err.message).toEqual('User is currupted');
    }
  });

  it('should not be able authenticate a user with status different of created', async () => {
    jest
      .spyOn(userHashProvider, 'compareHash')
      .mockImplementationOnce(async () => {
        return true;
      });
    jest.spyOn(hashProvider, 'compareHash').mockImplementationOnce(async () => {
      return true;
    });

    const email = 'johndoe@identity.com';
    const password = '123456';
    await usersRepository.create({
      status: UserStatus.Created,
      name: 'John Doe',
      email,
      password,
      hash: 'Valid User Hash',
    });

    try {
      await authenticateUser.execute({
        email,
        password,
      });
    } catch (err) {
      expect(err).toBeInstanceOf(AppError);
      expect(err.message).toEqual('User status is invalid');
    }
  });
});
