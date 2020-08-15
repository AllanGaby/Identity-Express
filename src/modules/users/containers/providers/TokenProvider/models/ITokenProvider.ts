import ICreateTokenDTO from '../dtos/ICreateTokenDTO';
import IVerifyTokenDTO from '../dtos/IVerifyTokenDTO';

export default interface ITokenProvider {
  signIn(data: ICreateTokenDTO): Promise<string>;
  verify(token: string): Promise<IVerifyTokenDTO>;
}
