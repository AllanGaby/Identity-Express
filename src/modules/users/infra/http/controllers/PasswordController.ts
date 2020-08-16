import 'reflect-metadata';
import { Request, Response } from 'express';
import { container } from 'tsyringe';
import ChangePasswordService from '@modules/users/services/ChangePasswordService';
import { classToClass } from 'class-transformer';

export default class PasswordController {
  public async update(request: Request, response: Response): Promise<Response> {
    const changePassword = container.resolve(ChangePasswordService);
    const { token } = request.params;
    const { password } = request.body;
    const user = await changePassword.execute({
      token,
      password,
    });
    return response.json(classToClass(user));
  }
}
