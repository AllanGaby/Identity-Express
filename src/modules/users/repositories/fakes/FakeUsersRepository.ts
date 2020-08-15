import { v4 } from 'uuid';
import User from '@modules/users/entities/User';
import IUsersRepository from '../models/IUsersRepository';

export default class FakeUsersRepository implements IUsersRepository {
  private users: User[] = [];

  public async findById(id: string): Promise<User | undefined> {
    return this.users.find(user => user.id === id);
  }

  public async findByName(name: string): Promise<User | undefined> {
    return this.users.find(user => user.name === name);
  }

  public async findByEmail(email: string): Promise<User | undefined> {
    return this.users.find(user => user.email === email);
  }

  public async findAll(): Promise<User[]> {
    return this.users;
  }

  public async create(userToCreate: Omit<User, 'id'>): Promise<User> {
    const user = {
      ...userToCreate,
      id: v4(),
    };
    this.users.push(user);
    return {
      ...user,
    };
  }

  public async update(userToUpdate: User): Promise<User> {
    const userIndex = this.users.findIndex(user => user.id === userToUpdate.id);
    if (userIndex >= 0) {
      this.users[userIndex] = userToUpdate;
    } else {
      this.users.push(userToUpdate);
    }
    return {
      ...userToUpdate,
    };
  }
}
