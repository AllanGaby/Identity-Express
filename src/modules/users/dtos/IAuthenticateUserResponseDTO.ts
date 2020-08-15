import User from '../entities/User';

export default interface IAuthenticateUserResponseDTO {
  user: User;
  token: string;
}
