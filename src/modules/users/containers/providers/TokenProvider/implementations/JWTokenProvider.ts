import { sign, verify } from 'jsonwebtoken';
import authConfig from '@config/auth';
import AppError from '@shared/errors/AppError';
import IVerifyTokenDTO from '../dtos/IVerifyTokenDTO';
import ICreateTokenDTO from '../dtos/ICreateTokenDTO';
import ITokenProvider from '../models/ITokenProvider';

interface ITokenPayload {
  ait: number;
  exp: number;
  sub: string;
}

export default class JWTokenProvider implements ITokenProvider {
  public async signIn({ payload, subject }: ICreateTokenDTO): Promise<string> {
    const { secret } = authConfig.jwt;
    return sign(payload, secret, {
      subject,
      expiresIn: '1d',
    });
  }

  public async verify(token: string): Promise<IVerifyTokenDTO> {
    try {
      const { secret } = authConfig.jwt;
      const decoded = verify(token, secret);
      const { sub } = decoded as ITokenPayload;
      return {
        subject: sub,
      };
    } catch {
      throw new AppError('Invalid JWT token', 401);
    }
  }
}
