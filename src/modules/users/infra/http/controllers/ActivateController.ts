import 'reflect-metadata';
import { Request, Response } from 'express';
import { container } from 'tsyringe';
import ActivateUserService from '@modules/users/services/ActivateUserService';

export default class ActivateController {
  public async update(request: Request, response: Response): Promise<Response> {
    const activateUser = container.resolve(ActivateUserService);
    const { id } = request.params;
    const user = await activateUser.execute({
      id,
    });
    return response.json(user);
  }
}
