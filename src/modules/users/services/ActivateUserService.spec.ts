import AppError from '@shared/errors/AppError';
import FakeHashProvider from '@shared/containers/providers/HashProvider/fakes/FakeHashProvider';
import FakeCacheProvider from '@shared/containers/providers/CacheProvider/fakes/FakeCacheProvider';
import { UserStatus } from '../entities/User';
import ActivateUserService from './ActivateUserService';
import UserHashProvider from '../containers/providers/UserHashProvider/implementations/UserHashProvider';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';

let hashProvider: FakeHashProvider;
let userHashProvider: UserHashProvider;
let cacheProvider: FakeCacheProvider;
let usersRepository: FakeUsersRepository;
let activateUser: ActivateUserService;
describe('ActivateUser', () => {
  beforeEach(() => {
    hashProvider = new FakeHashProvider();
    userHashProvider = new UserHashProvider(hashProvider);
    cacheProvider = new FakeCacheProvider();
    usersRepository = new FakeUsersRepository();
    activateUser = new ActivateUserService(
      userHashProvider,
      cacheProvider,
      usersRepository,
    );
  });

  it('should be able activate user', async () => {
    jest
      .spyOn(userHashProvider, 'compareHash')
      .mockImplementationOnce(async () => {
        return true;
      });
    const user = await usersRepository.create({
      status: UserStatus.Created,
      name: 'John Doe',
      email: 'johndoe@identity.com',
      password: '123456',
      hash: 'Valid User Hash',
    });

    const userActivated = await activateUser.execute({ id: user.id });
    expect(userActivated).toHaveProperty('status');
    expect(userActivated.status).toEqual(UserStatus.Validated);
  });

  it('should not be able activate a non-exists user', async () => {
    try {
      await activateUser.execute({ id: 'non-exists user id' });
    } catch (err) {
      expect(err).toBeInstanceOf(AppError);
      expect(err.statusCode).toEqual(404);
    }
  });

  it('should not be able activate a user corrupted', async () => {
    const user = await usersRepository.create({
      status: UserStatus.Created,
      name: 'John Doe',
      email: 'johndoe@identity.com',
      password: '123456',
      hash: 'Invalid User Hash',
    });

    jest
      .spyOn(userHashProvider, 'compareHash')
      .mockImplementationOnce(async () => {
        return false;
      });

    try {
      await activateUser.execute({ id: user.id });
    } catch (err) {
      expect(err).toBeInstanceOf(AppError);
      expect(err.message).toEqual('User is currupted');
    }
  });

  it('should not be able activate a user with status different of created', async () => {
    const user = await usersRepository.create({
      status: UserStatus.Validated,
      name: 'John Doe',
      email: 'johndoe@identity.com',
      password: '123456',
      hash: 'Valid User Hash',
    });

    jest
      .spyOn(userHashProvider, 'compareHash')
      .mockImplementationOnce(async () => {
        return true;
      });

    try {
      await activateUser.execute({ id: user.id });
    } catch (err) {
      expect(err).toBeInstanceOf(AppError);
      expect(err.message).toEqual('User status is invalid to activate');
    }
  });
});
