import 'reflect-metadata';
import { inject, injectable } from 'tsyringe';
import AppError from '@shared/errors/AppError';
import path from 'path';
import uploadConfig from '@config/upload';
import IShowAvatarDTO from '../dtos/IShowAvatarDTO';
import IUsersRepository from '../repositories/models/IUsersRepository';

@injectable()
export default class CreateUserService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) {}

  public async execute({ userId }: IShowAvatarDTO): Promise<string | null> {
    const userById = await this.usersRepository.findById(userId);
    if (!userById) {
      throw new AppError('User not found', 404);
    }
    const { extentionAvatar } = userById;
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
