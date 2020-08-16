import 'reflect-metadata';
import { inject, injectable } from 'tsyringe';
import AppError from '@shared/errors/AppError';
import path from 'path';
import uploadConfig from '@config/upload';
import IUserHashProvider from '../containers/providers/UserHashProvider/models/IUserHashProvider';
import IShowAvatarDTO from '../dtos/IShowAvatarDTO';
import IUsersRepository from '../repositories/models/IUsersRepository';

@injectable()
export default class CreateUserService {
  constructor(
    @inject('UserHashProvider')
    private userHashProvider: IUserHashProvider,
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) {}

  public async execute({ userId }: IShowAvatarDTO): Promise<string | null> {
    const userById = await this.usersRepository.findById(userId);
    if (!userById) {
      throw new AppError('User not found', 404);
    }
    const { name, email, password, hash, status, extentionAvatar } = userById;
    const isUserHashValid = await this.userHashProvider.compareHash(
      {
        name,
        email,
        password,
        status,
      },
      hash,
    );
    if (!isUserHashValid) {
      throw new AppError('User is currupted');
    }
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
