import ListUsersService from './ListUsersService';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import { UserStatus } from '../entities/User';

let usersRepository: FakeUsersRepository;
let listUsers: ListUsersService;
describe('ListUsers', () => {
  beforeEach(() => {
    usersRepository = new FakeUsersRepository();
    listUsers = new ListUsersService(usersRepository);
  });

  it('should be able list all users', async () => {
    await usersRepository.create({
      name: 'John Doe',
      email: 'johndoe@identity.com',
      password: '123456',
      hash: 'Valid Hash To User',
      status: UserStatus.Created,
    });

    await usersRepository.create({
      name: 'John Tre',
      email: 'johntre@identity.com',
      password: '123456',
      hash: 'Valid Hash To User',
      status: UserStatus.Created,
    });

    const users = await listUsers.execute();
    expect(users).toHaveLength(2);
  });
});
