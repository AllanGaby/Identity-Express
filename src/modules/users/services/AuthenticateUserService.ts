import 'reflect-metadata';
import { inject, injectable } from 'tsyringe';
import AppError from '@shared/errors/AppError';
import IHashProvider from '@shared/containers/providers/HashProvider/models/IHashProvider';
import IUserHashProvider from '../containers/providers/UserHashProvider/models/IUserHashProvider';
import { UserStatus } from '../entities/User';
import IAuthenticateUserRequestDTO from '../dtos/IAuthenticateUserRequestDTO';
import IAuthenticateUserResponseDTO from '../dtos/IAuthenticateUserResponseDTO';
import ITokenProvider from '../containers/providers/TokenProvider/models/ITokenProvider';
import IUsersRepository from '../repositories/models/IUsersRepository';

@injectable()
export default class AuthenticateUserService {
  constructor(
    @inject('UserHashProvider')
    private userHashProvider: IUserHashProvider,
    @inject('TokenProvider')
    private tokenProvider: ITokenProvider,
    @inject('HashProvider')
    private hashProvider: IHashProvider,
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) {}

  public async execute({
    email,
    password,
  }: IAuthenticateUserRequestDTO): Promise<IAuthenticateUserResponseDTO> {
    const userByEmail = await this.usersRepository.findByEmail(email);
    if (!userByEmail) {
      throw new AppError(`Credentials is incorrect`);
    }
    const isPasswordCorrect = await this.hashProvider.compareHash(
      password,
      userByEmail.password,
    );
    if (!isPasswordCorrect) {
      throw new AppError(`Credentials is incorrect`);
    }
    const { name, hash, status } = userByEmail;
    if (status !== UserStatus.Validated) {
      throw new AppError(`User status is invalid`);
    }

    const isUserHashValid = await this.userHashProvider.compareHash(
      {
        name,
        email,
        password: userByEmail.password,
        status,
      },
      hash,
    );
    if (!isUserHashValid) {
      throw new AppError('User is currupted');
    }
    const token = await this.tokenProvider.signIn({
      payload: {},
      subject: userByEmail.id,
    });

    delete userByEmail.password;
    delete userByEmail.hash;
    delete userByEmail.extentionAvatar;
    return {
      token,
      user: userByEmail,
    };
  }
}
