import AppError from '@shared/errors/AppError';
import uploadConfig from '@config/upload';
import path from 'path';
import ShowAvatarUserService from './ShowAvatarUserService';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import { UserStatus } from '../entities/User';

let usersRepository: FakeUsersRepository;
let showAvatarUser: ShowAvatarUserService;
describe('ShowAvatarUser', () => {
  beforeEach(() => {
    usersRepository = new FakeUsersRepository();
    showAvatarUser = new ShowAvatarUserService(usersRepository);
  });

  it('should be able show avatar user', async () => {
    const newUser = await usersRepository.create({
      name: 'John Doe',
      email: 'johndoe@identity.com',
      password: '123456',
      hash: 'Valid Hash To User',
      extentionAvatar: '.jpg',
      status: UserStatus.Created,
    });

    const avatarPath = await showAvatarUser.execute({
      userId: newUser.id,
    });

    expect(avatarPath).toEqual(
      path.resolve(
        uploadConfig.uploadDirectory,
        `${newUser.id}${newUser.extentionAvatar}`,
      ),
    );
  });

  it('should not be able non-exists user', async () => {
    try {
      await showAvatarUser.execute({
        userId: 'non-exists user',
      });
    } catch (err) {
      expect(err).toBeInstanceOf(AppError);
      expect(err.message).toEqual('User not found');
      expect(err.statusCode).toEqual(404);
    }
  });

  it('should not be able user avatar of user without avatar', async () => {
    const newUser = await usersRepository.create({
      name: 'John Doe',
      email: 'johndoe@identity.com',
      password: '123456',
      hash: 'Valid Hash To User',
      status: UserStatus.Created,
    });

    const avatarPath = await showAvatarUser.execute({
      userId: newUser.id,
    });

    expect(avatarPath).toEqual(null);
  });
});
