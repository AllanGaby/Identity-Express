import 'reflect-metadata';
import { Request, Response } from 'express';
import { container } from 'tsyringe';
import AuthenticateUserService from '@modules/users/services/AuthenticateUserService';

export default class LoginController {
  public async create(request: Request, response: Response): Promise<Response> {
    const authenticateUser = container.resolve(AuthenticateUserService);
    const { email, password } = request.body;
    const authenticate = await authenticateUser.execute({
      email,
      password,
    });
    return response.json(authenticate);
  }
}
