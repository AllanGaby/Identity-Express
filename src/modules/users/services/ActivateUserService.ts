import 'reflect-metadata';
import { inject, injectable } from 'tsyringe';
import AppError from '@shared/errors/AppError';
import ICacheProvider from '@shared/containers/providers/CacheProvider/models/ICacheProvider';
import IUserHashProvider from '../containers/providers/UserHashProvider/models/IUserHashProvider';
import User, { UserStatus } from '../entities/User';
import IActivateUserDTO from '../dtos/IActivateUserDTO';
import IUsersRepository from '../repositories/models/IUsersRepository';

@injectable()
export default class CreateUserService {
  constructor(
    @inject('UserHashProvider')
    private userHashProvider: IUserHashProvider,
    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) {}

  public async execute({ id }: IActivateUserDTO): Promise<User> {
    const userById = await this.usersRepository.findById(id);
    if (!userById) {
      throw new AppError('User not found', 404);
    }
    const { name, email, password, hash, status } = userById;
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
    if (userById.status !== UserStatus.Created) {
      throw new AppError('User status is invalid to activate');
    }
    const newStatus = UserStatus.Validated;
    const newHash = await this.userHashProvider.generateHash({
      name,
      email,
      password,
      status: newStatus,
    });
    const user = await this.usersRepository.update({
      id,
      email,
      name,
      password,
      status: newStatus,
      hash: newHash,
    });
    await this.cacheProvider.invalidate(`users:${user.id}`);
    return user;
  }
}
