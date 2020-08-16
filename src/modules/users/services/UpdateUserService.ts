import 'reflect-metadata';
import { inject, injectable } from 'tsyringe';
import AppError from '@shared/errors/AppError';
import IHashProvider from '@shared/containers/providers/HashProvider/models/IHashProvider';
import IMailProvider from '@shared/containers/providers/MailProvider/models/IMailProvider';
import IStorageProvider from '@shared/containers/providers/StorageProvider/models/IStorageProvider';
import path from 'path';
import fs from 'fs';
import uploadConfig from '@config/upload';
import IUserHashProvider from '../containers/providers/UserHashProvider/models/IUserHashProvider';
import User from '../entities/User';
import IUpdateUserDTO from '../dtos/IUpdateUserDTO';
import IUsersRepository from '../repositories/models/IUsersRepository';

@injectable()
export default class UpdateUserService {
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
    id,
    name: newName,
    email: newEmail,
    password: newPassword,
    temporaryAvatarPath,
  }: IUpdateUserDTO): Promise<User> {
    const userById = await this.usersRepository.findById(id);
    if (!userById) {
      throw new AppError('User not found', 404);
    }
    const { status, name, email, password, hash } = userById;
    if (newName && newName !== name) {
      const userByName = await this.usersRepository.findByName(newName);
      if (userByName && userById.id !== userByName.id) {
        throw new AppError(`There is a user with the name ${newName}`);
      }
    }
    let updateEmail = false;
    if (newEmail && newEmail !== email) {
      updateEmail = true;
      const userByEmail = await this.usersRepository.findByEmail(newEmail);
      if (userByEmail && userById.id !== userByEmail.id) {
        throw new AppError(`There is a user with the e-mail ${newEmail}`);
      }
    }
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
    const emailToUpdate = newEmail || email;
    const nameToUpdate = newName || name;
    let passwordHash;
    if (newPassword) {
      passwordHash = await this.hashProvider.generateHash(newPassword);
    } else {
      passwordHash = password;
    }
    const newHash = await this.userHashProvider.generateHash({
      email: emailToUpdate,
      name: nameToUpdate,
      status,
      password: passwordHash,
    });
    const extentionAvatar = temporaryAvatarPath
      ? path.extname(temporaryAvatarPath)
      : undefined;
    const user = await this.usersRepository.update({
      id,
      name: nameToUpdate,
      email: emailToUpdate,
      password: passwordHash,
      hash: newHash,
      status,
      extentionAvatar,
    });

    if (updateEmail) {
      const templateFilePath = path.resolve(
        __dirname,
        '..',
        'views',
        'update_user.hbs',
      );

      await this.mailProvider.sendMail({
        to: {
          name: nameToUpdate,
          email: emailToUpdate,
        },
        subject: `${nameToUpdate} - Seu perfil foi atualizado com sucesso`,
        templateDate: {
          templateFilePath,
          variables: {
            name: nameToUpdate,
            old_mail: email,
            new_mail: emailToUpdate,
          },
        },
      });
    }

    if (temporaryAvatarPath) {
      const sourceFilePath = path.resolve(
        uploadConfig.temporaryDir,
        temporaryAvatarPath,
      );
      const destinationFile = `${user.id}${user.extentionAvatar}`;
      const fileExists = await this.storageProvider.fileExists(destinationFile);
      if (fileExists) {
        await this.storageProvider.deleteFile(destinationFile);
      }
      await this.storageProvider.saveFile({
        sourceFilePath,
        destinationFile,
      });
    }
    return user;
  }
}
