import IUserHashDTO from '../dtos/IUserHashDTO';

export default class IUserHashProvider {
  private getPayload({ name, password, email, status }: IUserHashDTO): string {
    return name + password + email + status.toString();
  }

  public async generateHash(user: IUserHashDTO): Promise<string> {
    return this.getPayload(user);
  }

  public async compareHash(
    user: IUserHashDTO,
    hashed: string,
  ): Promise<boolean> {
    return this.getPayload(user) === hashed;
  }
}
