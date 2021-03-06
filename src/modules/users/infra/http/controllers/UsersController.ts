import 'reflect-metadata';
import { Request, Response } from 'express';
import { container } from 'tsyringe';
import CreateUserService from '@modules/users/services/CreateUserService';
import UpdateUserService from '@modules/users/services/UpdateUserService';
import ListUsersService from '@modules/users/services/ListUsersService';
import ShowUserService from '@modules/users/services/ShowUserService';
import { classToClass } from 'class-transformer';

export default class UsersController {
  public async create(request: Request, response: Response): Promise<Response> {
    const { name, email, password } = request.body;
    let avatarFile = '';
    if (request.file) {
      avatarFile = request.file.filename;
    }
    const createUser = container.resolve(CreateUserService);
    const user = await createUser.execute({
      name,
      email,
      password,
      avatarFile,
    });
    return response.status(201).json(classToClass(user));
  }

  public async update(request: Request, response: Response): Promise<Response> {
    const updateUser = container.resolve(UpdateUserService);
    const { name, email, password } = request.body;
    const { id } = request.params;
    let avatarFile = '';
    if (request.file) {
      avatarFile = request.file.filename;
    }
    const user = await updateUser.execute({
      id,
      name,
      email,
      password,
      avatarFile,
    });
    return response.json(classToClass(user));
  }

  public async list(request: Request, response: Response): Promise<Response> {
    const listUsers = container.resolve(ListUsersService);
    const users = await listUsers.execute();
    if (users) {
      return response.json(classToClass(users));
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
      return response.json(classToClass(user));
    }

    return response.status(404);
  }
}
