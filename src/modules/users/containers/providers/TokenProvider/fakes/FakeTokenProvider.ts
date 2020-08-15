import ICreateTokenDTO from '../dtos/ICreateTokenDTO';
import IVerifyTokenDTO from '../dtos/IVerifyTokenDTO';
import ITokenProvider from '../models/ITokenProvider';

export default class FakeTokenProvider implements ITokenProvider {
  public async signIn({ payload, subject }: ICreateTokenDTO): Promise<string> {
    return subject;
  }

  public async verify(token: string): Promise<IVerifyTokenDTO> {
    return {
      subject: token,
    };
  }
}
