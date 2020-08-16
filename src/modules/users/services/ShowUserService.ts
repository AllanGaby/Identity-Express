import 'reflect-metadata';
import { inject, injectable } from 'tsyringe';
import IUsersRepository from '../repositories/models/IUsersRepository';
import User from '../entities/User';
import IShowUserDTO from '../dtos/IShowUserDTO';

@injectable()
export default class ListUsersService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) {}

  public async execute({ userId }: IShowUserDTO): Promise<User | undefined> {
    const user = await this.usersRepository.findById(userId);
    return user;
  }
}
