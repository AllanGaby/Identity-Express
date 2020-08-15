import AppError from '@shared/errors/AppError';
import FakeMailProvider from '@shared/containers/providers/MailProvider/fakes/FakeMailProvider';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeSessionsRepository from '../repositories/fakes/FakeSessionsRepository';
import FakeUserHashProvider from '../containers/providers/UserHashProvider/fakes/FakeUserHashProvider';
import ForgotPasswordService from './ForgotPasswordService';
import { UserStatus } from '../entities/User';

let userHashProvider: FakeUserHashProvider;
let mailProvider: FakeMailProvider;
let usersRepository: FakeUsersRepository;
let sessionsRepository: FakeSessionsRepository;
let forgotPassword: ForgotPasswordService;

describe('ForgotPassword', () => {
  beforeEach(() => {
    userHashProvider = new FakeUserHashProvider();
    mailProvider = new FakeMailProvider();
    usersRepository = new FakeUsersRepository();
    sessionsRepository = new FakeSessionsRepository();
    forgotPassword = new ForgotPasswordService(
      userHashProvider,
      mailProvider,
      usersRepository,
      sessionsRepository,
    );
  });

  it('should be able send forgot password mail to user', async () => {
    jest
      .spyOn(userHashProvider, 'compareHash')
      .mockImplementationOnce(async () => {
        return true;
      });
    const onSendMail = jest.spyOn(mailProvider, 'sendMail');
    const user = await usersRepository.create({
      name: 'User to Forgot Password',
      email: 'forgotpassword@identity.com',
      password: '123456',
      hash: 'Valid User Hash',
      status: UserStatus.Validated,
    });

    await forgotPassword.execute({
      email: user.email,
    });

    expect(onSendMail).toHaveBeenCalledTimes(1);
  });

  it('should not be able send forgot password mail to non-exists user', async () => {
    const onSendMail = jest.spyOn(mailProvider, 'sendMail');
    try {
      await forgotPassword.execute({
        email: 'notexistsuser@identity.com',
      });
    } catch (err) {
      expect(err).toBeInstanceOf(AppError);
      expect(err.message).toEqual('Users not found');
      expect(err.statusCode).toEqual(404);
      expect(onSendMail).not.toHaveBeenCalled();
    }
  });

  it('should not be able send forgot password mail to user corrupted', async () => {
    jest
      .spyOn(userHashProvider, 'compareHash')
      .mockImplementationOnce(async () => {
        return false;
      });
    const onSendMail = jest.spyOn(mailProvider, 'sendMail');
    const user = await usersRepository.create({
      name: 'User to Forgot Password',
      email: 'forgotpassword@identity.com',
      password: '123456',
      hash: 'Valid User Hash',
      status: UserStatus.Validated,
    });

    try {
      await forgotPassword.execute({
        email: user.email,
      });
    } catch (err) {
      expect(err).toBeInstanceOf(AppError);
      expect(err.message).toEqual('User is currupted');
      expect(onSendMail).not.toHaveBeenCalled();
    }
  });

  it('should not be able send forgot password mail to user with status invalid', async () => {
    jest
      .spyOn(userHashProvider, 'compareHash')
      .mockImplementationOnce(async () => {
        return true;
      });
    const onSendMail = jest.spyOn(mailProvider, 'sendMail');
    const user = await usersRepository.create({
      name: 'User to Forgot Password',
      email: 'forgotpassword@identity.com',
      password: '123456',
      hash: 'Valid User Hash',
      status: UserStatus.Created,
    });

    try {
      await forgotPassword.execute({
        email: user.email,
      });
    } catch (err) {
      expect(err).toBeInstanceOf(AppError);
      expect(err.message).toEqual('User status is invalid');
      expect(onSendMail).not.toHaveBeenCalled();
    }
  });
});
