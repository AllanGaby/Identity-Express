import 'reflect-metadata';
import { inject, injectable } from 'tsyringe';
import AppError from '@shared/errors/AppError';
import IHashProvider from '@shared/containers/providers/HashProvider/models/IHashProvider';
import IMailProvider from '@shared/containers/providers/MailProvider/models/IMailProvider';
import IStorageProvider from '@shared/containers/providers/StorageProvider/models/IStorageProvider';
import path from 'path';
import fs from 'fs';
import IUserHashProvider from '../containers/providers/UserHashProvider/models/IUserHashProvider';
import User, { UserStatus } from '../entities/User';
import ICreateUserDTO from '../dtos/ICreateUserDTO';
import IUsersRepository from '../repositories/models/IUsersRepository';

@injectable()
export default class CreateUserService {
  constructor(
    @inject('UserHashProvider')
    private userHashProvider: IUserHashProvider,
    @inject('HashProvider')
    private hashProvider: IHashProvider,
    @inject('MailProvider')
    private mailProvider: IMailProvider,
    @inject('StorageProvider')
    private storageProvider: IStorageProvider,
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) {}

  public async execute({
    name,
    email,
    password,
    temporaryAvatarPath,
  }: ICreateUserDTO): Promise<User> {
    const userByName = await this.usersRepository.findByName(name);
    if (userByName) {
      throw new AppError(`There is a user with the name ${name}`);
    }
    const userByEmail = await this.usersRepository.findByEmail(email);
    if (userByEmail) {
      throw new AppError(`There is a user with the e-mail ${email}`);
    }
    const status = UserStatus.Created;
    const passwordHash = await this.hashProvider.generateHash(password);
    const hash = await this.userHashProvider.generateHash({
      email,
      name,
      status,
      password: passwordHash,
    });
    const user = await this.usersRepository.create({
      name,
      email,
      password: passwordHash,
      hash,
      status,
    });

    if (temporaryAvatarPath) {
      await this.storageProvider.saveFile({
        sourceFilePath: temporaryAvatarPath,
        destinationFile: user.id,
      });
      await fs.promises.unlink(temporaryAvatarPath);
    }

    const templateFilePath = path.resolve(
      __dirname,
      '..',
      'views',
      'create_user.hbs',
    );
    await this.mailProvider.sendMail({
      to: {
        name,
        email,
      },
      subject: `${name} seja bem vindo`,
      templateDate: {
        templateFilePath,
        variables: {
          name,
          link: 'Link para ativar a conta',
        },
      },
    });

    delete user.password;
    delete user.hash;
    return user;
  }
}
