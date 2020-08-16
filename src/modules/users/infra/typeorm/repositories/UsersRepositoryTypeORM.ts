import { getRepository, Repository } from 'typeorm';
import IUsersRepository from '@modules/users/repositories/models/IUsersRepository';
import User from '@modules/users/entities/User';
import UserTypeORM from '../entities/User';

export default class UsersRepositoryTypeORM implements IUsersRepository {
  private typeORMRepository: Repository<UserTypeORM>;

  constructor() {
    this.typeORMRepository = getRepository(UserTypeORM);
  }

  public async findById(id: string): Promise<User | undefined> {
    const user = await this.typeORMRepository.findOne(id);
    return user;
  }

  public async findByName(name: string): Promise<User | undefined> {
    const user = await this.typeORMRepository.findOne({
      where: {
        name,
      },
    });
    return user;
  }

  public async findByEmail(email: string): Promise<User | undefined> {
    const user = await this.typeORMRepository.findOne({
      where: {
        email,
      },
    });
    return user;
  }

  public async findAll(): Promise<User[]> {
    const users = await this.typeORMRepository.find();
    return users;
  }

  public async create(userToCreate: Omit<User, 'id'>): Promise<User> {
    const user = this.typeORMRepository.create({
      ...userToCreate,
    });
    await this.typeORMRepository.save(user);
    return user;
  }

  public async update(userToUpdate: User): Promise<User> {
    await this.typeORMRepository.save(userToUpdate);
    return userToUpdate;
  }
}
