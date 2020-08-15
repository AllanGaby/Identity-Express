import { Request, Response } from 'express';
import { container } from 'tsyringe';
import CreateUserService from '@modules/users/services/CreateUserService';
import UpdateUserService from '@modules/users/services/UpdateUserService';
import ListUsersService from '@modules/users/services/ListUsersService';
import ShowUserService from '@modules/users/services/ShowUserService';
import ActivateUserService from '@modules/users/services/ActivateUserService';

export default class UsersController {
  public async create(request: Request, response: Response): Promise<Response> {
    const createUser = container.resolve(CreateUserService);
    const { name, email, password } = request.body;
    console.log(request.body);
    const user = await createUser.execute({
      name,
      email,
      password,
    });
    return response.status(201).json(user);
  }

  public async activate(
    request: Request,
    response: Response,
  ): Promise<Response> {
    const activateUser = container.resolve(ActivateUserService);
    const { id } = request.params;
    const user = await activateUser.execute({
      id,
    });
    return response.json(user);
  }

  public async update(request: Request, response: Response): Promise<Response> {
    const updateUser = container.resolve(UpdateUserService);
    const { name, email, password } = request.body;
    const { id } = request.params;
    const user = await updateUser.execute({
      id,
      name,
      email,
      password,
    });
    return response.json(user);
  }

  public async list(request: Request, response: Response): Promise<Response> {
    const listUsers = container.resolve(ListUsersService);
    const users = await listUsers.execute();
    if (users) {
      return response.json(users);
    }
    return response.status(404);
  }

  public async show(request: Request, response: Response): Promise<Response> {
    const showUser = container.resolve(ShowUserService);
    const { id } = request.params;
    const user = await showUser.execute({
      userId: id,
    });
    if (user) {
      return response.json(user);
    }

    return response.status(404);
  }
}
