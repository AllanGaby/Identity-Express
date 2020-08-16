import 'reflect-metadata';
import { injectable, inject } from 'tsyringe';
import AppError from '@shared/errors/AppError';
import IHashProvider from '@shared/containers/providers/HashProvider/models/IHashProvider';
import IChangePasswordDTO from '../dtos/IChangePasswordDTO';
import IForgotPasswordSessionsRepository from '../repositories/models/IForgotPasswordSessionsRepository';
import IUsersRepository from '../repositories/models/IUsersRepository';
import IUserHashProvider from '../containers/providers/UserHashProvider/models/IUserHashProvider';
import User, { UserStatus } from '../entities/User';

@injectable()
export default class ChangePasswordService {
  constructor(
    @inject('UserHashProvider')
    private userHashProvider: IUserHashProvider,
    @inject('HashProvider')
    private hashProvider: IHashProvider,
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
    @inject('ForgotPasswordSessionsRepository')
    private forgotPasswordSessionsRepository: IForgotPasswordSessionsRepository,
  ) {}

  public async execute({
    password: newPassword,
    token,
  }: IChangePasswordDTO): Promise<User> {
    const sessionById = await this.forgotPasswordSessionsRepository.findById(
      token,
    );
    if (!sessionById) {
      throw new AppError('Session not found', 404);
    }
    const { userId, validationDate } = sessionById;
    if (Date.now() > validationDate.getTime()) {
      throw new AppError('Session is expired');
    }
    const userById = await this.usersRepository.findById(userId);
    if (!userById) {
      throw new AppError('Users not found', 404);
    }
    const { id, name, email, status, password, hash } = userById;
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
    if (status !== UserStatus.Validated) {
      throw new AppError('User status is invalid');
    }
    const passwordHash = await this.hashProvider.generateHash(newPassword);
    const newHash = await this.userHashProvider.generateHash({
      email,
      name,
      password: passwordHash,
      status,
    });
    const updatedUser = await this.usersRepository.update({
      id,
      name,
      email,
      password: passwordHash,
      hash: newHash,
      status,
    });
    return updatedUser;
  }
}
