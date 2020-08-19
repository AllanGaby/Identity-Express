import 'reflect-metadata';
import { inject, injectable } from 'tsyringe';
import ICacheProvider from '@shared/containers/providers/CacheProvider/models/ICacheProvider';
import { classToClass } from 'class-transformer';
import IUsersRepository from '../repositories/models/IUsersRepository';
import User from '../entities/User';
import IShowUserDTO from '../dtos/IShowUserDTO';

@injectable()
export default class ListUsersService {
  constructor(
    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) {}

  public async execute({ userId }: IShowUserDTO): Promise<User | undefined> {
    const cacheUserKey = `users:${userId}`;
    let user = await this.cacheProvider.recover<User>(cacheUserKey);
    if (!user) {
      user = await this.usersRepository.findById(userId);
      if (user) {
        await this.cacheProvider.save({
          key: cacheUserKey,
          value: classToClass(user),
        });
      }
    }

    return user;
  }
}
