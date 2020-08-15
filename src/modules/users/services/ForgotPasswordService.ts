import 'reflect-metadata';
import { inject, injectable } from 'tsyringe';
import AppError from '@shared/errors/AppError';
import IMailProvider from '@shared/containers/providers/MailProvider/models/IMailProvider';
import path from 'path';
import IUserHashProvider from '../containers/providers/UserHashProvider/models/IUserHashProvider';
import IForgotPasswordDTO from '../dtos/IForgotPasswordDTO';
import IUsersRepository from '../repositories/models/IUsersRepository';
import ISessionsRepository from '../repositories/models/IForgotPasswordSessionsRepository';
import { UserStatus } from '../entities/User';

@injectable()
export default class ForgotPasswordService {
  constructor(
    @inject('UserHashProvider')
    private userHashProvider: IUserHashProvider,
    @inject('MailProvider')
    private mailProvider: IMailProvider,
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
    @inject('SessionsRepository')
    private sessionsRepository: ISessionsRepository,
  ) {}

  public async execute({ email }: IForgotPasswordDTO): Promise<void> {
    const userByEmail = await this.usersRepository.findByEmail(email);
    if (!userByEmail) {
      throw new AppError('Users not found', 404);
    }
    const { name, password, status, hash } = userByEmail;
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
    const validationDate = new Date();
    validationDate.setHours(validationDate.getHours() + 2);

    await this.sessionsRepository.create({
      userId: userByEmail.id,
      validationDate,
    });

    const templateFilePath = path.resolve(
      __dirname,
      '..',
      'views',
      'forgot_password.hbs',
    );
    await this.mailProvider.sendMail({
      to: {
        name,
        email,
      },
      subject: `${name} - Recuperar senha`,
      templateDate: {
        templateFilePath,
        variables: {
          name,
          link: 'Link para recuperar a senha',
        },
      },
    });
  }
}
