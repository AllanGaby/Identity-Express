import 'reflect-metadata';
import { Request, Response } from 'express';
import { container } from 'tsyringe';
import ShowAvatarUserService from '@modules/users/services/ShowAvatarUserService';

export default class ActivateController {
  public async show(request: Request, response: Response): Promise<Response> {
    const showAvatar = container.resolve(ShowAvatarUserService);
    const { id } = request.params;
    const avatarPath = await showAvatar.execute({
      userId: id,
    });
    if (avatarPath) {
      response.sendFile(avatarPath);
      return response;
    }
    return response.status(404);
  }
}
