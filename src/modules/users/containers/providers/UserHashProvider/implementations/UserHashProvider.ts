import 'reflect-metadata';
import { inject, injectable } from 'tsyringe';
import IHashProvider from '@shared/containers/providers/HashProvider/models/IHashProvider';
import IUsersHashProvider from '../models/IUserHashProvider';
import IUserHashDTO from '../dtos/IUserHashDTO';

@injectable()
export default class UserHashProvider implements IUsersHashProvider {
  constructor(
    @inject('HashProvider')
    private hashProvider: IHashProvider,
  ) {}

  private getPayload({ name, password, email, status }: IUserHashDTO): string {
    return name + password + email + status.toString();
  }

  public async generateHash(user: IUserHashDTO): Promise<string> {
    return this.hashProvider.generateHash(this.getPayload(user));
  }

  public async compareHash(
    user: IUserHashDTO,
    hashed: string,
  ): Promise<boolean> {
    return this.hashProvider.compareHash(this.getPayload(user), hashed);
  }
}
