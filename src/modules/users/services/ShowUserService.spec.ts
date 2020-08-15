import ShowUserService from './ShowUserService';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import { UserStatus } from '../entities/User';

let usersRepository: FakeUsersRepository;
let showUser: ShowUserService;
describe('ShowUser', () => {
  beforeEach(() => {
    usersRepository = new FakeUsersRepository();
    showUser = new ShowUserService(usersRepository);
  });

  it('should be able show user', async () => {
    const newUser = await usersRepository.create({
      name: 'John Doe',
      email: 'johndoe@identity.com',
      password: '123456',
      hash: 'Valid Hash To User',
      status: UserStatus.Created,
    });

    const user = await showUser.execute({
      userId: newUser.id,
    });

    expect(user).toHaveProperty('name');
    expect(user?.name).toEqual(newUser.name);
    expect(user).toHaveProperty('email');
    expect(user?.email).toEqual(newUser.email);
    expect(user).toHaveProperty('id');
    expect(user?.id).toEqual(newUser.id);
    expect(user).not.toHaveProperty('hash');
    expect(user).not.toHaveProperty('password');
  });

  it('should not be able non-exists user', async () => {
    const user = await showUser.execute({
      userId: 'non-exists user',
    });

    expect(user).toEqual(undefined);
  });
});
