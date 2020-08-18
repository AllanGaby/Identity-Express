import 'reflect-metadata';
import { inject, injectable } from 'tsyringe';
import AppError from '@shared/errors/AppError';
import path from 'path';
import uploadConfig from '@config/upload';
import ICacheProvider from '@shared/containers/providers/CacheProvider/models/ICacheProvider';
import IShowAvatarDTO from '../dtos/IShowAvatarDTO';
import IUsersRepository from '../repositories/models/IUsersRepository';
import User from '../entities/User';

@injectable()
export default class CreateUserService {
  constructor(
    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) {}

  public async execute({ userId }: IShowAvatarDTO): Promise<string | null> {
    const cacheUserKey = `users:${userId}`;
    let user = await this.cacheProvider.recover<User>(cacheUserKey);
    if (!user) {
      user = await this.usersRepository.findById(userId);
      if (!user) {
        throw new AppError('User not found', 404);
      }
      await this.cacheProvider.save({
        key: cacheUserKey,
        value: user,
      });
    }
    const { extentionAvatar } = user;
    if (extentionAvatar) {
      const userAvatarPath = path.resolve(
        uploadConfig.uploadDirectory,
        `${userId}${extentionAvatar}`,
      );
      return userAvatarPath;
    }
    return null;
  }
}
