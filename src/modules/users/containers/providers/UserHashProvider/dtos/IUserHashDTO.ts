import { UserStatus } from '@modules/users/entities/User';

export default interface IUserHashDTO {
  name: string;
  email: string;
  password: string;
  status: UserStatus;
}
