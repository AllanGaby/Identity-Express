import IUserHashDTO from '../dtos/IUserHashDTO';

export default interface IUserHashProvider {
  generateHash(user: IUserHashDTO): Promise<string>;
  compareHash(user: IUserHashDTO, hashed: string): Promise<boolean>;
}
