import User from '../../entities/User';

export default interface IUsersRepository {
  findById(id: string): Promise<User | undefined>;
  findByName(name: string): Promise<User | undefined>;
  findByEmail(email: string): Promise<User | undefined>;
  findAll(): Promise<User[]>;
  create(userToCreate: Omit<User, 'id'>): Promise<User>;
  update(userToUpdate: User): Promise<User>;
}
