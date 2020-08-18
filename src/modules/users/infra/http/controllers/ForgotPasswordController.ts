import 'reflect-metadata';
import { Request, Response } from 'express';
import { container } from 'tsyringe';
import ForgotPasswordService from '@modules/users/services/ForgotPasswordService';

export default class ForgotPasswordController {
  public async create(request: Request, response: Response): Promise<Response> {
    const forgotPassword = container.resolve(ForgotPasswordService);
    const { email } = request.body;
    await forgotPassword.execute({
      email,
    });
    return response.status(204).send();
  }
}
