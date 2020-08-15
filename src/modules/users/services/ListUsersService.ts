import 'reflect-metadata';
import { inject, injectable } from 'tsyringe';
import IUsersRepository from '../repositories/models/IUsersRepository';
import User from '../entities/User';

@injectable()
export default class ListUsersService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) {}

  public async execute(): Promise<User[]> {
    return this.usersRepository.findAll();
  }
}
